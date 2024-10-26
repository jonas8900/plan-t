import { getServerSession } from "next-auth/next"
import { authOptions } from "./auth/[...nextauth]"

export default async function Restricted(request, response) {
  const session = await getServerSession(request, response, authOptions)

  if (session) {
    response.send({
      content:
        "This is protected content. You can access this content because you are signed in.",
    })
  } else {
    response.send({
      error: "You must be signed in to view the protected content on this page.",
    })
  }
}
