import { Command } from "commander";
import axios from "axios";
import fs from "fs";
import https from "https";

const command = new Command("resetstations")
  .description("reset the toll stations data in the system")
  .action(async () => {
    try {
      const tokenFilePath = ".auth_token";
      if (!fs.existsSync(tokenFilePath)) {
        console.error("You are not logged in.");
        return;
      }

      // Read the token from the file
      const token = fs.readFileSync(tokenFilePath, "utf-8").trim();

      const agent = new https.Agent({
        rejectUnauthorized: false, // Ignore self-signed cert
      });

      const response = await axios.post(
        "https://localhost:9115/api/admin/resetstations",
        {},
        {
          headers: {
            "x-observatory-auth": token, // Include the token in the header
          },
          httpsAgent: agent,
        }
      );

      console.log(response.data.status);
    } catch (error) {
      if (error.response) {
        const { status, data } = error.response;
        console.error(`Error ${status}: ${data.info}`);
      } else {
        console.error("Error:", error.message);
      }
    }
  });

export default command;
