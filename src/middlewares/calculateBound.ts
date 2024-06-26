import Ad from '../models/ads'


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

export async function getFilteredAds(data: any) {
    const query: any = { active: true };
    let page: any = data.page ? data.page : 1
  
    if (data.q) {      
      query.$or = [
        { title: { $regex: data.q, $options: 'i' } },
        { description: { $regex: data.q, $options: 'i' } }
      ]
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
  
    // Fetch the filtered and sorted ads with pagination
    const existingRecords = await Ad.find(query).sort(sortOption).skip(skip).limit(10);
    const totalDocuments = await Ad.countDocuments(query);
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