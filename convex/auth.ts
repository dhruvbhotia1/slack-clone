import { convexAuth } from "@convex-dev/auth/server";
import GitHub from "@auth/core/providers/github";
import Google from "@auth/core/providers/google";
import {Password} from "@convex-dev/auth/providers/Password";
import {DataModel} from "./_generated/dataModel";


const CustomPassword = Password<DataModel>({

  profile(params){
    return {

      email: params.email as string,
      name: params.name as string,

    }
  }


})

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [GitHub({
    authorization: {params: {scope: "read:user user:email"}},

    profile(profile) {
      return {
        id: profile.id.toString(),
        name: profile.name ?? profile.login,
        email: profile.email ?? profile.login,
        image: profile.avatar_url || ""
      }
    }
  }), Google, CustomPassword],
});
