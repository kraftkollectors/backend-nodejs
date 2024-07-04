import cron from 'node-cron'
import PaidAd from '../models/paidAd'

// Define the cron schedule (every 24 hours)
// At 00:00 every day
const cronExpression = '0 0 * * *'; 

// Function to update PaidAds
const updatePaidAds = async () => {
    try {
        const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0); // Set the current date time to midnight

        const ads = await PaidAd.find();

        for (const ad of ads) {
            const startDate = new Date(ad.startDate);
            startDate.setHours(0, 0, 0, 0); // Set the start date time to midnight

            // Calculate the end date based on duration
            const endDate = new Date(startDate);
            endDate.setDate(endDate.getDate() + ad.duration); // Assuming `duration` is in days

            if (startDate <= currentDate && currentDate <= endDate) {
                ad.isActive = true;
            } else if (currentDate > endDate) {
                ad.isActive = false;
            }

            await ad.save();
        }
    } catch (error) {
        console.error('Error updating PaidAds:', error);
    }
    
};

// Schedule the cron job
cron.schedule(cronExpression, () => {
    console.log('checking data...');
    updatePaidAds();
});