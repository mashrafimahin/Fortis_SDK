/**
   author  : Mashrafi Mahin
   role    : Founder & CEO
   project : Authentication & Authorization Service (SDK)
   created : 31/07/2026
   modified: 31/07/2026
**/

const baseUrl = "https://mahiin.netlify.app";

// flexible requests
const request = async (path, context, data) => {
  try {
    // merge data
    // const mergedData = {}
    // console.log({
    // projectId: context.projectId,
    // secretKey: context.secret,
    // dbURI: context.db,
    // data,
    // });

    // connect to api
    const response = await fetch(`${baseUrl}${path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(mergedData),
    });

    // check connection
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const result = await response.json();
    console.log(result);
    // return result;
  } catch (err) {
    // console.log(err);
    return err;
  }
};

// exports
module.exports = request;
