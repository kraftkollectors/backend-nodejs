import Ad from '../models/ads'
import PaidAd from '../models/paidAd'
import User from '../models/users'
import Contact from '../models/contact'
import Report from '../models/report'
import { Model } from 'mongoose';


// Function to calculate the bounding box for geo queries
function getBoundingBox(latitude: any, longitude: any, radiusInKm: any) {
    const R = 6371; // Earth's radius in km
    const lat = latitude;
    const lon = longitude;
  
    // Calculate the bounding box
    const maxLat = lat + (radiusInKm / R) * (180 / Math.PI);
    const minLat = lat - (radiusInKm / R) * (180 / Math.PI);
    const maxLon = lon + (radiusInKm / R) * (180 / Math.PI) / Math.cos(lat * Math.PI / 180);
    const minLon = lon - (radiusInKm / R) * (180 / Math.PI) / Math.cos(lat * Math.PI / 180);
  
    return {
      maxLat,
      minLat,
      maxLon,
      minLon,
    };
}

export async function getFilteredAdsForAdmin(data: any) {
  const query: any = {};
  let page: any = data.page ? data.page : 1;

  if (data.q) {
      const searchTerms = Array.from(new Set(data.q.split(' ').filter((term: any) => term.trim().length > 0)));
      query.$or = searchTerms.map(term => ({
          $or: [
              { title: { $regex: term, $options: 'i' } },
              { description: { $regex: term, $options: 'i' } }
          ]
      }));
  }

  if (data.only) {
      if (data.only === 'active') {
          query.active = true;
      } else if (data.only === 'inactive') {
          query.active = false;
      }
  }

  if (data.category) {
      query.category = data.category;
  }

  if (data.subCategory) {
      query.subCategory = data.subCategory;
  }

  if (data.minPrice) {
      query.estimatedPrice = { ...query.estimatedPrice, $gte: data.minPrice };
  }

  if (data.maxPrice) {
      query.estimatedPrice = { ...query.estimatedPrice, $lte: data.maxPrice };
  }

  if (data.location) {
      query.location = data.location;
  }

  if (data.longitude && data.latitude && data.radius) {
      const { maxLat, minLat, maxLon, minLon } = getBoundingBox(data.latitude, data.longitude, data.radius);
      query.latitude = { $gte: minLat, $lte: maxLat };
      query.longitude = { $gte: minLon, $lte: maxLon };
  }

  let sortOption: any = { createdAt: -1 };

  if (data.sort === 'lowest-price') {
      sortOption = { estimatedPrice: 1 };
  } else if (data.sort === 'highest-price') {
      sortOption = { estimatedPrice: -1 };
  } else if (data.sort === 'latest') {
      sortOption = { createdAt: -1 };
  } else if (data.sort === 'best-rating') {
      sortOption = { rating: -1 };
  }

  const skip = (page - 1) * 10;

  // Fetch the filtered and sorted ads with pagination, ensuring only ads from active users are included
  const existingRecords = await Ad.find(query)
      .populate({
        path: 'userId',
        select: '_id',
        match: { deleted: false }
      })
      .sort(sortOption)
      .skip(skip)
      .limit(10);

  // Filter out ads where the user is inactive (userId will be null if user is inactive)
  const filteredRecords = existingRecords
  .filter((record: any) => record.userId !== null)
  .map((record: any) => {
    // Convert userId to a string if it exists
    return {
      ...record.toObject(),
      userId: record.userId._id.toString()
    };
  });

  const totalDocuments = await Ad.countDocuments(query);
  const totalPages = Math.ceil(totalDocuments / 10);

  if (!filteredRecords || filteredRecords.length === 0) {
      return {
          data: {
              existingRecords: [],
              totalDocuments: 0,
              hasPreviousPage: false,
              previousPages: 0,
              hasNextPage: false,
              nextPages: 0,
              totalPages: 0,
              currentPage: page
          },
          statusCode: 201,
          msg: "Success"
      };
  }

  return {
      data: {
          existingRecords: filteredRecords,
          totalDocuments,
          hasPreviousPage: page > 1,
          previousPages: page > 1 ? page - 1 : 0,
          hasNextPage: page < totalPages,
          nextPages: page < totalPages ? page + 1 : 0,
          totalPages,
          currentPage: page
      },
      statusCode: 201,
      msg: "Success"
  };
}


export async function getFilteredAds(data: any) {
    const query: any = { active: true };
    let page: any = data.page ? data.page : 1
  
    if (data.q) {
      // Split and filter out duplicates using Set
      const searchTerms = Array.from(new Set(data.q.split(' ').filter((term:any) => term.trim().length > 0)));
      query.$or = searchTerms.map(term => ({
          $or: [
              { title: { $regex: term, $options: 'i' } },
              { description: { $regex: term, $options: 'i' } }
          ]
      }));
    }

    if (data.category) {
      query.category = data.category;
    }
  
    if (data.subCategory) {
      query.subCategory = data.subCategory;
    }
  
    if (data.minPrice) {
      query.estimatedPrice = { ...query.estimatedPrice, $gte: data.minPrice };
    }
  
    if (data.maxPrice) {
      query.estimatedPrice = { ...query.estimatedPrice, $lte: data.maxPrice };
    }
  
    if (data.location) {
      query.location = data.location;
    }
  
    if (data.longitude && data.latitude && data.radius) {
      const { maxLat, minLat, maxLon, minLon } = getBoundingBox(data.latitude, data.longitude, data.radius);
      query.latitude = { $gte: minLat, $lte: maxLat };
      query.longitude = { $gte: minLon, $lte: maxLon };
    }
  
    // Default sorting
    let sortOption: any = { createdAt: -1 };
  
    if (data.sort === 'lowest-price') {
      sortOption = { estimatedPrice: 1 };
    } else if (data.sort === 'highest-price') {
      sortOption = { estimatedPrice: -1 };
    } else if (data.sort === 'latest') {
      sortOption = { createdAt: -1 };
    } else if (data.sort === 'best-rating') {
      sortOption = { rating: -1 };
    }
  
    // Calculate the skip value for pagination
    const skip = (page - 1) * 10;
  
    // Fetch the filtered and sorted ads with pagination, ensuring only ads from active users are included
    const existingRecords = await Ad.find(query)
    .populate({
      path: 'userId',
      select: '_id',
      match: { deleted: false }
    })
    .sort(sortOption)
    .skip(skip)
    .limit(10);

  // Filter out ads where the user is inactive (userId will be null if user is inactive) 
  const filteredRecords = existingRecords
  .filter((record: any) => record.userId !== null)
  .map((record: any) => {
    // Convert userId to a string if it exists
    return {
      ...record.toObject(),
      userId: record.userId._id.toString()
    };
  });

  const totalDocuments = await Ad.countDocuments(query);
  const totalPages = Math.ceil(totalDocuments / 10);

  if (!filteredRecords || filteredRecords.length === 0) {
    return {
        data: {
            existingRecords: [],
            totalDocuments: 0,
            hasPreviousPage: false,
            previousPages: 0,
            hasNextPage: false,
            nextPages: 0,
            totalPages: 0,
            currentPage: page
        },
        statusCode: 201,
        msg: "Success"
    };
  }

  return {
    data: {
        existingRecords: filteredRecords,
        totalDocuments,
        hasPreviousPage: page > 1,
        previousPages: page > 1 ? page - 1 : 0,
        hasNextPage: page < totalPages,
        nextPages: page < totalPages ? page + 1 : 0,
        totalPages,
        currentPage: page
    },
    statusCode: 201,
    msg: "Success"
  };
}


export async function getFilteredPaidAds(data: any) {
    const query: any = {};
    let page: any = data.page ? data.page : 1
  
    if (data.q) {      
      query.$or = [
        { title: { $regex: data.q, $options: 'i' } },
      ]
    }

    if(data.only){
      if (data.activeOnly === 'true') {
        query.isActive = true;
      }else if (data.only === 'false') {
        query.isActive = false;
      }
    }
  
    // Default sorting
    let sortOption: any = { createdAt: -1 };
  
    if (data.sort === 'date') {
      sortOption = { createdAt: -1 };
    } else if (data.sort === 'a-z') {
      sortOption = { title: 1 };
    }
  
    // Calculate the skip value for pagination
    const skip = (page - 1) * 10;
  
    // Fetch the filtered and sorted ads with pagination
    const existingRecords = await PaidAd.find(query).sort(sortOption).skip(skip).limit(10);
    const totalDocuments = await PaidAd.countDocuments(query);
    const totalPages = Math.ceil(totalDocuments / 10);

    if (!existingRecords || existingRecords.length === 0) {
        return { 
            data: { 
                existingRecords, 
                totalDocuments: 0,
                hasPreviousPage: false, 
                previousPages: 0, 
                hasNextPage: false,      
                nextPages: 0,
                totalPages: 0,
                currentPage: page
            },  
            statusCode: 201, 
            msg: "Success" 
        }
    }
  
    return {
        data: {
            existingRecords,
            totalDocuments,
            hasPreviousPage: page > 1,
            previousPages: page > 1 ? page - 1 : 0,
            hasNextPage: page < totalPages,
            nextPages: page < totalPages ? page + 1 : 0,
            totalPages,
            currentPage: page,
        },  
        statusCode: 201, 
        msg: "Success" 
    };
}

export async function getFilteredContact<T>(data: any) {
    const query: any = {};
    let page: any = data.page ? data.page : 1

    if (data.q) {      
      query.$or = [
        { name: { $regex: data.q, $options: 'i' } },
        { email: { $regex: data.q, $options: 'i' } },
        { message: { $regex: data.q, $options: 'i' } }
      ]
    }

    if(data.only){
      if (data.only === 'unread') {
        query.read = false;
      }else if (data.only === 'unresolved') {
        query.resolved = false;
      }
    }
  
    // Default sorting
    let sortOption: any = { createdAt: -1 };

    // Calculate the skip value for pagination
    const skip = (page - 1) * 10;
  
    // Fetch the filtered and sorted ads with pagination
    const existingRecords = await Contact.find(query).sort(sortOption).skip(skip).limit(10);
    const totalDocuments = await Contact.countDocuments(query);
    const totalPages = Math.ceil(totalDocuments / 10);

    if (!existingRecords || existingRecords.length === 0) {
        return { 
            data: { 
                existingRecords, 
                totalDocuments: 0,
                hasPreviousPage: false, 
                previousPages: 0, 
                hasNextPage: false,      
                nextPages: 0,
                totalPages: 0,
                currentPage: page
            },  
            statusCode: 201, 
            msg: "Success" 
        }
    }
  
    return {
        data: {
            existingRecords,
            totalDocuments,
            hasPreviousPage: page > 1,
            previousPages: page > 1 ? page - 1 : 0,
            hasNextPage: page < totalPages,
            nextPages: page < totalPages ? page + 1 : 0,
            totalPages,
            currentPage: page,
        },  
        statusCode: 201, 
        msg: "Success" 
    };
}


export async function getFilteredReport<T>(data: any) {
    const query: any = {};
    let page: any = data.page ? data.page : 1

    if (data.q) {      
      query.$or = [
        { text: { $regex: data.q, $options: 'i' } }
      ]
    }

    if(data.only){
      if (data.only === 'unread') {
        query.read = false;
      }else if (data.only === 'unresolved') {
        query.resolved = false;
      }
    }
  
    // Default sorting
    let sortOption: any = { createdAt: -1 };

    // Calculate the skip value for pagination
    const skip = (page - 1) * 10;
  
    // Fetch the filtered and sorted ads with pagination
    const existingRecords = await Report.find(query)
        .populate({
            path: 'reporterId',
            match: { deleted: false },
            select: '_id'
        })
        .populate({
            path: 'reportedId',
            match: { deleted: false },
            select: '_id'
        })
        .sort(sortOption)
        .skip(skip)
        .limit(10);

    // Filter out reports where both reporterId and reportedId are deleted
    const filteredRecords = existingRecords
    .filter((record: any) => record.reporterId || record.reportedId)
    .map((record: any) => {
      // Convert reporterId and reportedId to strings if they exist
      return {
        ...record.toObject(),
        reporterId: record.reporterId ? record.reporterId._id.toString() : null,
        reportedId: record.reportedId ? record.reportedId._id.toString() : null,
      };
    });

    const totalDocuments = await Report.countDocuments(query);
    const totalPages = Math.ceil(totalDocuments / 10);

    if (!filteredRecords || filteredRecords.length === 0) {
        return { 
            data: { 
                existingRecords: [], 
                totalDocuments: 0,
                hasPreviousPage: false, 
                previousPages: 0, 
                hasNextPage: false,      
                nextPages: 0,
                totalPages: 0,
                currentPage: page
            },  
            statusCode: 201, 
            msg: "Success" 
        }
    }
  
    return {
        data: {
            existingRecords: filteredRecords,
            totalDocuments,
            hasPreviousPage: page > 1,
            previousPages: page > 1 ? page - 1 : 0,
            hasNextPage: page < totalPages,
            nextPages: page < totalPages ? page + 1 : 0,
            totalPages,
            currentPage: page,
        },  
        statusCode: 201, 
        msg: "Success" 
    };
}

export async function getFilteredUsers(data: any) {
    const query: any = { deleted: false };
    let page: any = data.page ? data.page : 1
  
    if (data.q) {      
      query.$or = [
        { firstName: { $regex: data.q, $options: 'i' } },
        { lastName: { $regex: data.q, $options: 'i' } },
        { userName: { $regex: data.q, $options: 'i' } },
        { email: { $regex: data.q, $options: 'i' } }
      ]
    }

    if(data.artisanOnly){
      if (data.artisanOnly === 'true') {
        query.isArtisan = true;
      }else if (data.artisanOnly === 'false') {
        query.isArtisan = false;
      }
    }
  
    // Default sorting
    let sortOption: any = { createdAt: -1 };
  
    if (data.sort === 'date') {
      sortOption = { createdAt: -1 };
    } else if (data.sort === 'a-z') {
      sortOption = { firstName: 1 };
    }
  
    // Calculate the skip value for pagination
    const skip = (page - 1) * 10;
  
    // Fetch the filtered and sorted ads with pagination
    const existingRecords = await User.find(query).sort(sortOption).skip(skip).limit(10);
    const totalDocuments = await User.countDocuments(query);
    const totalPages = Math.ceil(totalDocuments / 10);

    if (!existingRecords || existingRecords.length === 0) {
        return { 
            data: { 
                existingRecords, 
                totalDocuments: 0,
                hasPreviousPage: false, 
                previousPages: 0, 
                hasNextPage: false,      
                nextPages: 0,
                totalPages: 0,
                currentPage: page
            },  
            statusCode: 201, 
            msg: "Success" 
        }
    }
  
    return {
        data: {
            existingRecords,
            totalDocuments,
            hasPreviousPage: page > 1,
            previousPages: page > 1 ? page - 1 : 0,
            hasNextPage: page < totalPages,
            nextPages: page < totalPages ? page + 1 : 0,
            totalPages,
            currentPage: page,
        },  
        statusCode: 201, 
        msg: "Success" 
    };
}


export async function getUsersSet(data: any) {
    const query: any = {isArtisan: true, deleted : false };
    let page: any = data.page ? data.page : 1
  
    if (data.q) {
        // Split and filter out duplicates using Set
        const searchTerms = Array.from(new Set(data.q.split(' ').filter((term: any) => term.trim().length > 0)));
        query.$or = searchTerms.map(term => ({
            $or: [
                { firstName: { $regex: term, $options: 'i' } },
                { lastName: { $regex: term, $options: 'i' } },
                { userName: { $regex: term, $options: 'i' } },
                { email: { $regex: term, $options: 'i' } }
            ]
        }));
    }
  
    // Default sorting
    let sortOption: any = { createdAt: -1 };
  
    if (data.sort === 'date') {
      sortOption = { createdAt: -1 };
    } else if (data.sort === 'a-z') {
      sortOption = { firstName: 1 };
    }
  
    // Calculate the skip value for pagination
    const skip = (page - 1) * 10;
  
    // Fetch the filtered and sorted ads with pagination
    const existingRecords = await User.find(query).sort(sortOption).skip(skip).limit(10);
    const totalDocuments = await User.countDocuments(query);
    const totalPages = Math.ceil(totalDocuments / 10);

    if (!existingRecords || existingRecords.length === 0) {
        return { 
            data: { 
                existingRecords, 
                totalDocuments: 0,
                hasPreviousPage: false, 
                previousPages: 0, 
                hasNextPage: false,      
                nextPages: 0,
                totalPages: 0,
                currentPage: page
            },  
            statusCode: 201, 
            msg: "Success" 
        }
    }
  
    return {
        data: {
            existingRecords,
            totalDocuments,
            hasPreviousPage: page > 1,
            previousPages: page > 1 ? page - 1 : 0,
            hasNextPage: page < totalPages,
            nextPages: page < totalPages ? page + 1 : 0,
            totalPages,
            currentPage: page,
        },  
        statusCode: 201, 
        msg: "Success" 
    };
}