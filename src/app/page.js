import { redirect } from "next/navigation";

// Root "/" redirects directly to the events discovery page.
// All branding and navigation is now on /events via the shared Navbar.
export default function HomePage() {
  redirect("/events");
}
