import { currentUser } from "@clerk/nextjs/server";

const STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;

export default checkUser = async () => {
  const user = await currentUser();

  if (!user) {
    console.log("User Not Found");
    return null;
  }

  if (!STRAPI_API_TOKEN) {
    console.error("X STRAPI_API_TOKEN is missing in .env.local");
    return null;
  }
  const subscriptionTier = "free"; //to be implemented

  try {
    const existingUserResponse = await fetch(
      `${STRAPI_URL}/api/users?filters[clerkId]
            [$eq]=${user.id}`,
      {
        headers: {
          Authorization: `Bearer ${STRAPI_API_TOKEN}`,
        },
        cache: "no-store",
      },
    );
    if(!existingUserResponse.ok){
        const errorText = await existingUserResponse.text();
        console.error("Strapi error response", errorText);
        return null;
    }
    const existingUserData = await existingUserResponse.json();
    if(existingUserData.length > 0){
        const existingUser = existingUserData[0];

        if(existingUser.subscriptionTier !== subscriptionTier){
            await fetch(`${STRAPI_URL}/api/users/${existingUser.id}`, {
                method: "PUT",
                header: {
                    "content-type": "application/json",
                    Authorization: `Bearer ${STRAPI_API_TOKEN}`,
                },
                body: JSON.stringify({subscriptionTier}),
            });
        }
        return  {...existingUser, subscriptionTier};
    }

    //creating new user strapi

    const rolesResponse = await fetch(
        `${STRAPI_URL}/api/users-permissions/roles`,
        {
            headers: {
                Authorization: `Bearer ${STRAPI_API_TOKEN}`
            },
        }
    );

  } catch (error) {}
};
