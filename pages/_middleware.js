
import { nextSafe } from "next-safe";

export default function middleware(req, ev) {
  return nextSafe({
    scriptSrc: ["'self'", "https://localhost:3000", "https://plan-t-one.vercel.app", "'unsafe-inline'"],
    scriptSrcElem: ["'self'", "https://localhost:3000", "https://plan-t-one.vercel.app"],
  })(req, ev);
}
