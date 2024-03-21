"use client";
import React from "react";
import { Input } from "../../../components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import CryptoJS from "crypto-js";

type Props = {};

const page = (props: Props) => {
  const passwordHash =
    "16955b0cd729017d6de042b663d9b85648e9ad513dc7d01cbb839ea986940f36";

  const [typedPassword, setTypedPassword] = React.useState("");
  const [isPasswordCorrect, setIsPasswordCorrect] = React.useState(false);
  return (
    <div className="w-full">
      {isPasswordCorrect ? (
        <div>
          <div className="wrapper">
            <input type="checkbox" id="ck1" />
            <label className="font-serif" htmlFor="ck1">
              I
            </label>
            <input type="checkbox" id="ck2" />
            <label htmlFor="ck2">love</label>
            <input type="checkbox" id="ck3" />
            <label className="font-sans italic" htmlFor="ck3">
              you
            </label>
          </div>
          <span className="">
            <h1
              className="bg-gradient-to-br
          text-9xl  
        font-sans italic font-light
        from-red-200 to-red-500 bg-clip-text text-transparent"
            >
              MY
            </h1>
            (BOOBOO😋😋)
          </span>
        </div>
      ) : (
        <div className="grid w-full max-w-sm items-center gap-1.5 m-auto">
          <Label htmlFor="password">GUESS THE PASSWORD!</Label>
          <div className="flex w-full items-center space-x-2">
            <Input
              type="password"
              onChange={(e) => setTypedPassword(e.target.value)}
              id="password"
              placeholder="WHAT IS THE PASSCODE ?"
            />
            <Button
              onClick={() => {
                setIsPasswordCorrect(
                  CryptoJS.SHA256(typedPassword).toString() === passwordHash
                );
              }}
              type="submit"
            >
              Subscribe
            </Button>
          </div>
          <Label className="text-red-500 font-mono" htmlFor="password">
            {CryptoJS.SHA256(typedPassword).toString().length > 0 &&
              "WRONG PASSWORD! TRY AGAIN!"}
          </Label>
        </div>
      )}
    </div>
  );
};

export default page;
