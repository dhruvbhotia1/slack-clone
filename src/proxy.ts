import {
    convexAuthNextjsMiddleware,
    nextjsMiddlewareRedirect
} from "@convex-dev/auth/nextjs/server";
import {createRouteMatcher} from "@convex-dev/auth/nextjs/server";

const isSignInPage = createRouteMatcher(["/auth"])

const isPublicPage = createRouteMatcher(["/"]);


export default convexAuthNextjsMiddleware(async (request, {convexAuth}) => {

    const isAuthenticated = await convexAuth.isAuthenticated();

    if(isPublicPage(request) &&  !isAuthenticated){

        return nextjsMiddlewareRedirect(request, "/auth");

    }

    if( isSignInPage(request) &&  isAuthenticated) {
        return nextjsMiddlewareRedirect(request, "/");
    }




});




export const config = {
    // The following matcher runs middleware on all routes
    // except static assets.
    matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};