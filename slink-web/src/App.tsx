import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import {
  PopoverTrigger,
  PopoverContent,
  Popover,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import "./App.css";
import { useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import { CalendarDaysIcon, CopyIcon, LinkIcon } from "./assets/icons";

function isValidURL(value: string): boolean {
  return /^(?:(?:(?:https?):)?\/\/)?(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(
    value,
  );
}

export default function App() {
  const [isVisible, setIsVisible] = useState(false);
  const [isExpiryVisible, setIsExpiryVisible] = useState(false);
  const [shortenedURL, setShortenedURL] = useState("");
  const [inputValue, setInputValue] = useState("");
  const { getToken } = useAuth();
  const nextDay = new Date();
  nextDay.setDate(nextDay.getDate() + 3);
  const [expiryDate, setExpiryDate] = useState<Date | undefined>(nextDay);

  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const { toast } = useToast();
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  function onInputFocusHandler() {
    setShortenedURL("");
    setIsVisible(false);
    setIsExpiryVisible(true);
  }
  function copyHandler() {
    window.navigator.clipboard.writeText(shortenedURL);
    toast({
      title: "Copied to clipboard",
    });
  }
  async function shortenURLHandler() {
    if (!isValidURL(inputValue)) {
      toast({
        variant: "destructive",
        title: "Invalid URL",
      });
      return;
    }
    var url = inputValue;
    if (!/^https?:\/\//i.test(inputValue)) {
      url = "http://" + inputValue;
    }

    const token = await getToken();
    const headers: { Authorization?: string; "Content-Type": string } = {
      "Content-Type": "application/json",
    };

    if (token !== null) {
      headers.Authorization = `Bearer ${token}`;
    }

    fetch(`${import.meta.env.VITE_APP_API_URL}/api/urls`, {
      method: "POST",
      headers: headers,
      body: JSON.stringify({
        original_url: url,
        expiry_date: expiryDate?.toISOString(),
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        setShortenedURL(data.shortened_url);
        setIsVisible(true);
      })
      .catch((error) => {
        console.error("Error:", error);
        toast({
          variant: "destructive",
          title: "Request failed",
        });
      });
  }
  return (
    <div className="bg-gray-800 rounded-lg shadow-md p-6 space-y-4">
      <div className="flex items-center space-x-2">
        <Input
          className="flex-1 bg-gray-700 text-gray-50 placeholder-gray-400 focus:ring-2 focus:ring-gray-500 focus:outline-none"
          placeholder="Enter a long URL"
          type="url"
          onFocus={onInputFocusHandler}
          onChange={handleInputChange}
          value={inputValue}
        />
      </div>
      <div
        className={`flex items-center justify-between space-x-2 text-gray-400 ${
          isExpiryVisible ? "" : "hidden"
        }`}
      >
        <div
          className={`flex items-center justify-between space-x-2 text-gray-400 ${
            isExpiryVisible ? "" : "hidden"
          }`}
        >
          <CalendarDaysIcon className="h-5 w-5" />
          <p>
            Expires on{" "}
            <span className="font-medium text-gray-300">
              {expiryDate?.toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </p>
        </div>
        <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
          <PopoverTrigger asChild>
            <Button className="bg-gray-600 hover:bg-gray-500 text-gray-50 focus:ring-2 focus:ring-gray-500 flex items-center space-x-2">
              <CalendarDaysIcon className="h-5 w-5" />
              <span className="sr-only">Set expiry date</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent align="start" className="w-auto p-0">
            <Calendar
              mode="single"
              selected={expiryDate}
              disabled={{ before: new Date() }}
              onSelect={(val) => {
                setExpiryDate(val);
                setIsCalendarOpen(false);
              }}
            />
          </PopoverContent>
        </Popover>
      </div>
      <div
        className={`flex items-center justify-between space-x-2 text-gray-400 ${
          isVisible ? "" : "hidden"
        }`}
      >
        <div className="flex items-center space-x-2">
          <LinkIcon className="h-5 w-5" />
          <p className="truncate">{shortenedURL}</p>
        </div>
        <Button
          className="text-gray-400 hover:bg-gray-600 hover:text-gray-50 "
          size="icon"
          variant="ghost"
          onClick={copyHandler}
        >
          <CopyIcon className="h-5 w-5" />
          <span className="sr-only">Copy short URL</span>
        </Button>
      </div>
      <div className="flex justify-stretch space-x-2 text-gray-400">
        <Button
          className="flex-1 bg-gray-600 hover:bg-gray-500 text-gray-50 focus:ring-2 focus:ring-gray-500"
          onClick={shortenURLHandler}
        >
          Shorten
        </Button>
      </div>
    </div>
  );
}
