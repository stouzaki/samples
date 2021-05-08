function makeRequest(message) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log(message);
      if (message === "Google") {
        resolve("Google says hi.");
      } else {
        reject("We can only talk to Google.");
      }
    }, 2000);
  });
}

function processRequest(response) {
  return new Promise((resolve, reject) => {
    console.log("Processing response");
    resolve(`Extra Information + ${response}`);
  });
}

window.onload = () => {
  console.log("Start onload.");
  doWork();
  console.log("End onload.");
};

async function doWork() {
  console.log("Start", "doWork()");
  try {
    {
      console.log("-- await使用版 --");
      const response = await makeRequest("Google");
      console.log("Response Received.");
      const processedResponse = await processRequest(response);
      console.log(processedResponse);
    }
    // {
    //   console.log("-- await未使用版 --");
    //   const response = makeRequest("Google");
    //   console.log("Response Received.");
    //   const processedResponse = processRequest(response);
    //   console.log(processedResponse);
    // }
  } catch (error) {
    console.log(error);
  } finally {
    console.log("End", "doWork()");
  }
}
