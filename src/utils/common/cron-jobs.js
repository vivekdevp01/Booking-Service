const cron = require("node-cron");
// const bookingService = require("../../services/booking-service");
const { BookingService } = require("../../services");
function scheduleCrons() {
  cron.schedule("*/10 * * * *", async () => {
    // console.log("starting cron", BookingService);
    await BookingService.cancelOldBookings();
    // console.log("Old Bookings Canceled", response);
  });
}
module.exports = scheduleCrons;
