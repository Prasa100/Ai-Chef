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
    if (!existingUserResponse.ok) {
      const errorText = await existingUserResponse.text();
      console.error("Strapi error response", errorText);
      return null;
    }
    const existingUserData = await existingUserResponse.json();
    if (existingUserData.length > 0) {
      const existingUser = existingUserData[0];

      if (existingUser.subscriptionTier !== subscriptionTier) {
        await fetch(`${STRAPI_URL}/api/users/${existingUser.id}`, {
          method: "PUT",
          header: {
            "content-type": "application/json",
            Authorization: `Bearer ${STRAPI_API_TOKEN}`,
          },
          body: JSON.stringify({ subscriptionTier }),
        });
      }
      return { ...existingUser, subscriptionTier };
    }

    //creating new user strapi

    const rolesResponse = await fetch(
      `${STRAPI_URL}/api/users-permissions/roles`,
      {
        headers: {
          Authorization: `Bearer ${STRAPI_API_TOKEN}`,
        },
      },
    );
    const rolesData = await rolesResponse.json();
    const authenticatedRole = rolesData.roles.find(
      (role) => role.type == "authenticated",
    );
    if (!authenticatedRole) {
      console.error("Authenticated Role not found");
      return null;
    }
    const userData = {
      username:
        user.username || user.emailAddresses[0].emailAddress.split("@")[0],
      email: user.emailAddresses[0].emailAddress,
      password: `clerk_managed_${user.id}_${Date.now()}`,
      confirmed: true,
      blocked: false,
      clerkId: user.id,
      firstname: user.firstName || "",
      lastname: user.lastname || "",
      imageUrl: user.imageUrl || "",
      subscriptionTier,
      role: authenticatedRole.id,
    };
    const newUserResponse = await fetch(`${STRAPI_URL}/api/users`, {
      method: "POST",
      header: {
        "content-Type": "application/json",
        Authorization: `Bearer ${STRAPI_API_TOKEN}`,
      },
      body: JSON.stringify(userData);
    });
    if(!newUserResponse.ok){
      const erroText = await newUserResponse.text();
      console.error("Error Creating User:", errorText);
      return null;
    }
    const newUser = await newUserResponse.json();
    return newUser;
  } catch (error) {
      console.error("Error in checkUser", error.message);
      return null;
  }
};
