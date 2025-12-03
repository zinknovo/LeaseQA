import type {Config} from "tailwindcss";
import sharedConfig from "@leaseqa/config/tailwind-config";

const config: Config = {
    ...sharedConfig,
    content: [
        "./app/**/*.{ts,tsx}",
        "./components/**/*.{ts,tsx}",
        "../../packages/ui/src/**/*.{ts,tsx}",
    ],
};

export default config;
