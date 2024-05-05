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

function isValidURL(value: string): boolean {
  return /^(?:(?:(?:https?):)?\/\/)?(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(
    value,
  );
}
export default function Component() {
  const [isVisible, setIsVisible] = useState(false);
  const [isExpiryVisible, setIsExpiryVisible] = useState(false);
  const [shortenedURL, setShortenedURL] = useState("");
  const [inputValue, setInputValue] = useState("");

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
  function shortenURLHandler() {
    if (!isValidURL(inputValue)) {
      toast({
        variant: "destructive",
        title: "Invalid URL",
      });
      console.log(inputValue);
      return;
    }
    setShortenedURL(inputValue);

    fetch(`${import.meta.env.VITE_APP_API_URL}/shorten`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        url: inputValue,
        expiry_date: expiryDate?.toISOString(),
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        setShortenedURL(data.url);
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

interface Props {
  className: string;
}

function CalendarDaysIcon(props: Props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
      <line x1="16" x2="16" y1="2" y2="6" />
      <line x1="8" x2="8" y1="2" y2="6" />
      <line x1="3" x2="21" y1="10" y2="10" />
      <path d="M8 14h.01" />
      <path d="M12 14h.01" />
      <path d="M16 14h.01" />
      <path d="M8 18h.01" />
      <path d="M12 18h.01" />
      <path d="M16 18h.01" />
    </svg>
  );
}

function CopyIcon(props: Props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
    </svg>
  );
}

function LinkIcon(props: Props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  );
}
