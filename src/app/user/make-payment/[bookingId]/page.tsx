
import Payment from "@/components/user/payment/payment";
import { bookingService } from "@/services/user/bookingService";


async function getBooking(bookingId: string){
  try{

    const res = await bookingService.fetchBookingById(bookingId)
    if(!res) return null;
    return res.data.data;
  }catch(err){
     console.log(err)
  }
}

export default async function paymentConfirmationPage({ params }: { params: { bookingId: string } }) {
      const bookingId = params.bookingId;
      console.log("bookignId", bookingId)
   const booking  = await getBooking(bookingId);
   console.log("booking is", booking)
   if(!booking) {
      return(
          <div className="p-10 text-center text-red-600 text-xl">
        Booking not found
      </div>
      );
   }
   return (
   

      <Payment booking={booking} />
  
   )
}