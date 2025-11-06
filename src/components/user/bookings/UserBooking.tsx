"use client";
import { useState, useEffect, useCallback, useMemo } from "react";
import Image from "next/image";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { useAppSelector } from "@/redux/hooks";
import { bookingService } from "@/services/user/bookingService";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FilterBar } from "@/components/ui/FilterBar";
import Pagination from "@/components/ui/Pagination";
import {
  Calendar,
  MapPin,
  User,
  Clock,
  CreditCard,
  FileText,
  Download,
  Eye,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";


interface Booking {
  _id: string;
  bookingId: string;
  eventId: string;
  eventName: string;
  eventImages?: string[];
  eventDate: string;
  eventLocation: string;
  organizerName: string;
  tickets: TicketInfo[];
  totalAmount: number;
  paymentStatus: string;
  paymentMethod: string;
  bookingDate: string;
}

interface TicketInfo {
  name: string;
  quantity: number;
  price: number;
}

const filterConfig = [
  {
    label: "Event Name",
    name: "title",
    type: "text" as const,
    placeholder: "Search events...",
  },
  {
    label: "Organizer Name",
    name: "organizerName",
    type: "text" as const,
    placeholder: "Filter by organizer...",
  },
  {
    label: "Payment Status",
    name: "status",
    type: "select" as const,
    options: ["Paid", "pending-payment", "Refunded"],
    placeholder: "All statuses",
  },
  {
    label: "Booking Date",
    name: "bookingDate",
    type: "date" as const,
  },
];

const PaymentStatusBadge = ({ status }: { status: string }) => {
  const statusConfig = {
    Paid: { variant: "default" as const, label: "Paid" },
    "pending-payment": { variant: "secondary" as const, label: "Pending" },
    Refunded: { variant: "outline" as const, label: "Refunded" },
  };

  const config =
    statusConfig[status as keyof typeof statusConfig] ||
    ({ variant: "outline" as const, label: status } as const);

  return <Badge variant={config.variant}>{config.label}</Badge>;
};

const BookingCardSkeleton = () => (
  <Card className="p-4 bg-muted/40">
    <CardContent className="flex gap-3 items-center p-0">
      <Skeleton className="w-16 h-16 rounded-md" />
      <div className="space-y-2 flex-1">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
        <Skeleton className="h-3 w-1/3" />
      </div>
    </CardContent>
  </Card>
);

const BookingDetailsSkeleton = () => (
  <div className="space-y-6">
    <div className="flex gap-4 items-start">
      <Skeleton className="w-28 h-28 rounded-md" />
      <div className="space-y-2 flex-1">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    </div>
    <div className="space-y-3">
      <Skeleton className="h-5 w-1/4" />
      {[1, 2].map((i) => (
        <Skeleton key={i} className="h-16 w-full" />
      ))}
    </div>
  </div>
);

export default function UserBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState<Record<string, string>>({
    organizerName: "",
    status: "",
    title: "",
    search: "",
    startDate: "",
    endDate: "",
  });
  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);

  const user = useAppSelector((state) => state.auth.user);
  const pageLimit = 5;

  const router = useRouter()


  const fetchBookings = useCallback(
    async (page = 1, appliedFilters: Record<string, string>) => {
      if (!user?.id) return;
      try {
        setLoading(true);
        const payload = {
          page,
          limit: pageLimit,
          organizerName: appliedFilters.organizerName,
          status: appliedFilters.status,
          title: appliedFilters.title,
        };
        const res = await bookingService.fetchAllBookings(user.id, payload);
        const bookingsList = res.data.data.bookingsList || [];
        setBookings(bookingsList);
        setTotalPages(res.data.data.totalPages || 1);
        if (bookingsList.length > 0 && !selectedBooking) {
          setSelectedBooking(bookingsList[0]);
        }
      } catch (err) {
        console.error("Error fetching bookings:", err);
      } finally {
        setLoading(false);
        setInitialLoad(false);
      }
    },
    [user?.id, selectedBooking]
  );

  useEffect(() => {
    if (!user?.id) return;
    const delay = setTimeout(() => {
      fetchBookings(currentPage, filters);
    }, 300);
    return () => clearTimeout(delay);
  }, [currentPage, filters, user?.id, fetchBookings]);

  const handleFilterApply = useCallback((values: Record<string, string>) => {
    setFilters((prev) => ({ ...prev, ...values }));
    setCurrentPage(1);
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const bookingList = useMemo(
    () => (
      <div className="flex flex-col gap-3 p-4">
        {bookings.map((booking, index) => (
          <motion.div
            key={booking._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card
              className={`cursor-pointer transition-all duration-200 hover:shadow-md border-2 ${
                selectedBooking?._id === booking._id
                  ? "border-primary bg-primary/10"
                  : "border-transparent hover:border-gray-300 bg-card"
              }`}
              onClick={() => setSelectedBooking(booking)}
            >
              <CardContent className="flex gap-3 items-center p-4">
                <div className="relative flex-shrink-0">
                  {booking.eventImages && booking.eventImages.length > 0 ? (
                    <Image
                      src={booking.eventImages[0]}
                      alt={booking.eventName}
                      width={64}
                      height={64}
                      className="rounded-md object-cover aspect-square"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-md bg-muted flex items-center justify-center">
                      <Calendar className="w-6 h-6 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm text-foreground truncate">
                    {booking.eventName}
                  </h3>
                  <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                    <Calendar className="w-3 h-3 text-primary" />
                    <span>{format(new Date(booking.eventDate), "dd MMM yyyy")}</span>
                  </div>
                  <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3 text-blue-500" />
                    <span>{format(new Date(booking.bookingDate), "dd MMM yyyy")}</span>
                  </div>
                  <div className="mt-2">
                    <PaymentStatusBadge status={booking.paymentStatus} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    ),
    [bookings, selectedBooking]
  );

  if (initialLoad) {
    return (
      <div className="flex flex-col gap-6">
        <FilterBar filters={filterConfig} values={filters} onApply={handleFilterApply} />
        <div className="flex h-[calc(100vh-15rem)] bg-background rounded-xl shadow-sm border overflow-hidden">
          <div className="w-1/3 border-r overflow-y-auto bg-muted/30">
            <div className="p-4 border-b">
              <Skeleton className="h-6 w-32" />
            </div>
            <div className="p-4 space-y-3">
              {[...Array(5)].map((_, i) => (
                <BookingCardSkeleton key={i} />
              ))}
            </div>
          </div>
          <div className="flex-1 p-6 overflow-y-auto bg-card">
            <BookingDetailsSkeleton />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <FilterBar filters={filterConfig} values={filters} onApply={handleFilterApply} />
      <div className="flex h-[calc(100vh-15rem)] rounded-xl shadow-md border overflow-hidden">
        {/* Left Panel */}
        <div className="w-1/3 border-r overflow-y-auto flex flex-col bg-muted/30">
          <div className="p-4 border-b bg-muted/50">
            <h2 className="text-xl font-semibold flex items-center gap-2 text-primary">
              My Bookings
              {bookings.length > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {bookings.length}
                </Badge>
              )}
            </h2>
          </div>
          <div className="flex-1 overflow-y-auto">{loading ? (
            <div className="p-4 space-y-3">
              {[...Array(5)].map((_, i) => (
                <BookingCardSkeleton key={i} />
              ))}
            </div>
          ) : bookings.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center h-full text-muted-foreground p-8"
            >
              <Calendar className="w-12 h-12 mb-4 text-primary/60" />
              <p className="text-center">No bookings found</p>
              <p className="text-sm text-center mt-2">
                Try adjusting your filters or explore new events
              </p>
            </motion.div>
          ) : (
            bookingList
          )}</div>
          {totalPages > 1 && (
            <div className="p-4 border-t bg-muted/50">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </div>

        {/* Right Panel */}
        <div className="flex-1 p-6 overflow-y-auto bg-card">
          <AnimatePresence mode="wait">
            {selectedBooking ? (
              <motion.div
                key={selectedBooking._id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="space-y-6 text-foreground"
              >
                <div className="flex gap-4 items-start">
                  <div className="relative flex-shrink-0">
                    {selectedBooking.eventImages && selectedBooking.eventImages.length > 0 ? (
                      <Image
                        src={selectedBooking.eventImages[0]}
                        alt={selectedBooking.eventName}
                        width={112}
                        height={112}
                        className="rounded-lg object-cover aspect-square shadow-md"
                      />
                    ) : (
                      <div className="w-28 h-28 rounded-lg bg-muted flex items-center justify-center shadow-md">
                        <Calendar className="w-8 h-8 text-primary" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <h2 className="text-2xl font-bold tracking-tight text-primary">
                        {selectedBooking.eventName}
                      </h2>
                      <PaymentStatusBadge status={selectedBooking.paymentStatus} />
                    </div>

                    <div className="space-y-2 mt-3 text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-primary" />
                        <span>
                          {format(
                            new Date(selectedBooking.eventDate),
                            "dd MMM yyyy, hh:mm a"
                          )}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-red-500" />
                        <span className="truncate">{selectedBooking.eventLocation}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-blue-500" />
                        <span>Organizer: {selectedBooking.organizerName}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-amber-500" />
                        <span>
                          Booked on{" "}
                          {format(
                            new Date(selectedBooking.bookingDate),
                            "dd MMM yyyy, hh:mm a"
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t" />

                <div>
                  <h3 className="text-lg font-semibold mb-3 text-primary">Tickets</h3>
                  <div className="space-y-2">
                    {selectedBooking.tickets.map((ticket, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Card className="bg-muted/30 border-none">
                          <CardContent className="flex justify-between items-center p-4">
                            <div>
                              <p className="font-semibold text-foreground">{ticket.name}</p>
                              <p className="text-sm text-muted-foreground">
                                Quantity: {ticket.quantity} × ₹{ticket.price}
                              </p>
                            </div>
                            <p className="font-semibold text-lg text-primary">
                              ₹{ticket.price * ticket.quantity}
                            </p>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div className="border-t" />

                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-primary">Payment Details</h3>
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-green-500" />
                    <span className="font-medium">Payment Status:</span>
                    <PaymentStatusBadge status={selectedBooking.paymentStatus} />
                  </div>
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-indigo-500" />
                    <span className="font-medium">Payment Method:</span>
                    <span className="capitalize text-foreground">
                      {selectedBooking.paymentMethod}
                    </span>
                  </div>
                  <div className="pt-2">
                    <p className="font-bold text-xl text-primary">
                      Total Paid: ₹{selectedBooking.totalAmount}
                    </p>
                  </div>
                </div>

                <div className="border-t" />

                <div className="flex gap-3 pt-2">
                  <Button onClick ={() => router.push(`/user/events/${selectedBooking.eventId}`)} variant="outline" className="flex items-center gap-2">
                    <Eye className="w-4 h-4 text-blue-600" />
                    View Event
                  </Button>
                  <Button className="flex items-center gap-2 bg-primary text-white hover:bg-primary/90">
                    <Download className="w-4 h-4" />
                    Download Invoice
                  </Button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center h-full text-muted-foreground"
              >
                <Calendar className="w-16 h-16 mb-4 text-primary/60" />
                <p className="text-lg font-medium text-foreground">Select a booking</p>
                <p className="text-sm text-center mt-2 max-w-sm">
                  Choose a booking from the list to view detailed information
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
