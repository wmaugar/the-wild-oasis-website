"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth, signIn, signOut } from "./auth";
import { getBookings } from "./data-service";
import { supabase } from "./supabase";

//when working on backend we should make sure of two things:
// 1. The user should have the authorization to of doing the action that the server action is supossed to do.
// 2. Always treat all inputs as unsafe.

export async function updateGuest(formData) {
  const session = await auth();
  if (!session) throw new Error("You must be logged in");

  const nationalID = formData.get("nationalID");
  const [nationality, countryFlag] = formData.get("nationality").split("%");
  // this regex test verify if the national ID has 6-12 alphanumeric characters
  if (!/^[a-zA-Z0-9]{6,12}$/.test(nationalID)) {
    throw new Error("Please provide a valid national ID");
  }
  const updateData = { nationality, countryFlag, nationalID };

  const { data, error } = await supabase
    .from("guests")
    .update(updateData)
    .eq("id", session.user.guestId)
    .select()
    .single();

  if (error) throw new Error("Guest could not be updated");
  // Revalidate data helps to clear Cached Data and refresh
  //this revalidate the cached data for this specific route and its children routes
  revalidatePath("/account/profile");
}

export async function createBooking(bookingData, formData) {
  // 1) Authentication
  console.log(formData);
  const session = await auth();
  if (!session) throw new Error("You must be logged in");

  //2) Build new Boooking
  const newBooking = {
    ...bookingData,
    guestId: session.user.guestId,
    numGuests: Number(formData.get("numGuests")),
    observations: formData.get("observations").slice(0, 1000),
    extrasPrice: 0,
    totalPrice: bookingData.cabinPrice,
    isPaid: false,
    hasBreakfast: false,
    status: "unconfirmed",
  };

  //3) CREATE new booking
  const { error } = await supabase.from("bookings").insert([newBooking]);
  if (error) throw new Error("Booking could not be created");

  //4)REVALIDATE DATA
  revalidatePath(`/cabins/${bookingData.cabinId}`);

  //5 REDIRECT
  redirect("/cabins/thankyou");
}

export async function deleteBooking(bookingId) {
  // For testing

  const session = await auth();
  if (!session) throw new Error("You must be logged in");

  // Here ensures that a user can only delete its own bookings, and not by mistake or malicious another guest's booking

  const guestBookings = await getBookings(session.user.guestId);
  const guestBookingsIds = guestBookings.map((booking) => booking.id);

  if (!guestBookingsIds.includes(bookingId))
    throw new Error("You are not allowed to delete this booking");

  const { error } = await supabase
    .from("bookings")
    .delete()
    .eq("id", bookingId);

  if (error) throw new Error("Booking could not be deleted");
  // revalidate CACHE DATA in this path
  //as an option is possible to revalidate a piece of data with revalidate TAG
  revalidatePath("/account/reservations");
}

export async function updateBooking(formData) {
  const bookingId = Number(formData.get("bookingId"));

  // 1) Authentication
  console.log(formData);
  const session = await auth();
  if (!session) throw new Error("You must be logged in");

  // 2) Authorization
  const guestBookings = await getBookings(session.user.guestId);
  const guestBookingsIds = guestBookings.map((booking) => booking.id);

  if (!guestBookingsIds.includes(bookingId))
    throw new Error("You are not allowed to update this booking");
  // 3) Building update data
  const updateData = {
    numGuests: Number(formData.get("numGuests")),
    //this protects from an inyection of millions of characters...
    observations: formData.get("observations").slice(0, 1000),
  };

  // 4) Mutation
  const { error } = await supabase
    .from("bookings")
    .update(updateData)
    .eq("id", bookingId)
    .select()
    .single();
  // 5) Error Handling
  if (error) throw new Error("Booking could not be updated");
  // 6) Revalidation
  revalidatePath(`/account/reservations/edit/${bookingId}`);
  revalidatePath("/account/reservations");
  // 7) Redirecting
  redirect("/account/reservations");
}

export async function signInAction() {
  await signIn("google", { redirectTo: "/account" });
}

export async function signOutAction() {
  await signOut({ redirectTo: "/" });
}
