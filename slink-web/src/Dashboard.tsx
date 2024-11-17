import { Button } from "@/components/ui/button";
import {
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenu,
} from "@/components/ui/dropdown-menu";
import {
  CardTitle,
  CardDescription,
  CardHeader,
  CardContent,
  Card,
} from "@/components/ui/card";
import { ResponsiveLine, Serie } from "@nivo/line";
import { BarDatum, ResponsiveBar } from "@nivo/bar";
import {
  TableHead,
  TableRow,
  TableHeader,
  TableCell,
  TableBody,
  Table,
} from "@/components/ui/table";
import { useEffect, useState } from "react";
import {
  UserClickStatsResponse,
  UserClickStatsResponseDataInner,
  UserStatsResponseTopUrlsInner,
} from "./generated";
import { useAuth } from "@clerk/clerk-react";
import { toast } from "./components/ui/use-toast";
import { CalendarDaysIcon } from "./assets/icons";
import { useNavigate } from "react-router-dom";

// Define the enum for date filters
type DateFilter = "LAST_7" | "LAST_30" | "LAST_90" | "LAST_365";
const DateFilters: { [key in DateFilter]: key } = {
  LAST_7: "LAST_7",
  LAST_30: "LAST_30",
  LAST_90: "LAST_90",
  LAST_365: "LAST_365",
};

// Create a mapping from the enum values to the display text
const filterTextMapping = {
  [DateFilters.LAST_7]: "Last 7 days",
  [DateFilters.LAST_30]: "Last 30 days",
  [DateFilters.LAST_90]: "Last 90 days",
  [DateFilters.LAST_365]: "Last 1 year",
};

export default function Dashboard() {
  const { userId, isLoaded } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (isLoaded && !userId) {
      toast({
        variant: "destructive",
        title: "You need to sign in",
      });
      navigate("/app/home");
    }
  }, [isLoaded]);

  const [selectedFilter, setSelectedFilter] = useState<DateFilter>(
    DateFilters.LAST_7,
  );

  return (
    isLoaded &&
    userId && (
      <div className="min-h-screen flex flex-1">
        <div className="mt-14 space-y-6 ">
          <div className="bg-gray-900 shadow-md pt-3 pb-6  px-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button className="bg-gray-600 hover:bg-gray-500 text-gray-50 focus:ring-2 focus:ring-gray-500 flex items-center space-x-2">
                      <CalendarDaysIcon className="h-5 w-5" />
                      <span>{filterTextMapping[selectedFilter]}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-auto p-0">
                    {Object.entries(filterTextMapping).map(([key, label]) => (
                      <DropdownMenuItem
                        key={key}
                        onClick={() => setSelectedFilter(key as DateFilter)}
                      >
                        {label}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TotalVisits />
              <UniqueVisits />
            </div>
            <TopUrls />
          </div>
        </div>
      </div>
    )
  );
}

function TopUrls() {
  const { getToken } = useAuth();
  const [urlStats, setUrlStats] = useState(
    Array<UserStatsResponseTopUrlsInner>,
  );
  async function getUserUrlStats() {
    const token = await getToken();
    const headers: { Authorization?: string; "Content-Type": string } = {
      "Content-Type": "application/json",
    };

    if (token !== null) {
      headers.Authorization = `Bearer ${token}`;
    }

    fetch(`${import.meta.env.VITE_APP_API_URL}/api/users/urls/stats`, {
      method: "GET",
      headers: headers,
    })
      .then((response) => response.json())
      .then((data) => {
        setUrlStats(data);
      })
      .catch((error) => {
        console.error("Error:", error);
        toast({
          variant: "destructive",
          title: "Request failed",
        });
      });
  }

  useEffect(() => {
    getUserUrlStats();
  }, []);
  function TopUrl({ url }: { url: UserStatsResponseTopUrlsInner }) {
    return (
      <TableRow>
        <TableCell className="font-medium">
          <div className="flex items-center space-x-2">
            <p className="truncate">{url.original_url}</p>
          </div>
        </TableCell>
        <TableCell>{url.total_visits}</TableCell>
        <TableCell>{url.unique_visits}</TableCell>
      </TableRow>
    );
  }
  return (
    <>
      <div>
        <h3 className="text-gray-50 font-bold text-lg mb-4">Top URLs</h3>
        <div className="border rounded-lg overflow-auto">
          <Table className="table-fixed text-white bg-gray-800">
            <TableHeader>
              <TableRow>
                <TableHead>URL</TableHead>
                <TableHead>Clicks</TableHead>
                <TableHead>Unique Visitors</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {urlStats &&
                urlStats.map((urlStat: UserStatsResponseTopUrlsInner) => {
                  return <TopUrl url={urlStat} />;
                })}
            </TableBody>
          </Table>
        </div>
      </div>
    </>
  );
}

function TotalVisits() {
  const { getToken } = useAuth();
  //TODO: Use React's lazy loading to fetch here
  const [clickStatsCount, setClickStatsCount] = useState(0);
  const [clickStatsData, setClickStatsData] = useState<Serie[]>();
  async function getUserUrlClickStats() {
    const token = await getToken();
    const headers: { Authorization?: string; "Content-Type": string } = {
      "Content-Type": "application/json",
    };

    if (token !== null) {
      headers.Authorization = `Bearer ${token}`;
    }

    fetch(
      `${import.meta.env.VITE_APP_API_URL}/api/users/clicks/stats?unique=false`,
      {
        method: "GET",
        headers: headers,
      },
    )
      .then((response) => response.json())
      .then((data) => {
        setClickStatsCount(data.count);
        setClickStatsData([
          {
            id: "TotalVisits",
            data: data.data.map((obj: UserClickStatsResponseDataInner) => ({
              x: obj.name,
              y: obj.count,
            })),
          },
        ]);
      })
      .catch((error) => {
        console.error("Error:", error);
        toast({
          variant: "destructive",
          title: "Request failed",
        });
      });
  }

  useEffect(() => {
    getUserUrlClickStats();
  }, []);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Total Clicks</CardTitle>
        <CardDescription>
          {clickStatsCount ? (
            <span className="text-4xl font-bold">{clickStatsCount}</span>
          ) : (
            <span className="text-4xl font-bold">Loading...</span>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="aspect-[9/4]">
          {clickStatsData ? (
            <ResponsiveLine
              data={clickStatsData}
              margin={{ top: 10, right: 10, bottom: 40, left: 40 }}
              xScale={{
                type: "point",
              }}
              yScale={{
                type: "linear",
              }}
              axisTop={null}
              axisRight={null}
              axisBottom={{
                tickSize: 0,
                tickPadding: 16,
              }}
              axisLeft={{
                tickSize: 0,
                tickValues: 5,
                tickPadding: 16,
              }}
              colors={["#2563eb", "#e11d48"]}
              pointSize={6}
              useMesh={true}
              gridYValues={6}
              theme={{
                tooltip: {
                  chip: {
                    borderRadius: "9999px",
                  },
                  container: {
                    fontSize: "12px",
                    textTransform: "capitalize",
                    borderRadius: "6px",
                  },
                },
                grid: {
                  line: {
                    stroke: "#f3f4f6",
                  },
                },
              }}
              role="application"
            />
          ) : (
            <p>Loading chart data...</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function UniqueVisits() {
  const { getToken } = useAuth();
  //TODO: Use React's lazy loading to fetch here
  const [clickStats, setClickStats] = useState<UserClickStatsResponse>();
  async function getUserUrlClickStats() {
    const token = await getToken();
    const headers: { Authorization?: string; "Content-Type": string } = {
      "Content-Type": "application/json",
    };

    if (token !== null) {
      headers.Authorization = `Bearer ${token}`;
    }

    fetch(
      `${import.meta.env.VITE_APP_API_URL}/api/users/clicks/stats?unique=true`,
      {
        method: "GET",
        headers: headers,
      },
    )
      .then((response) => response.json())
      .then((data) => {
        setClickStats(data);
      })
      .catch((error) => {
        console.error("Error:", error);
        toast({
          variant: "destructive",
          title: "Request failed",
        });
      });
  }

  useEffect(() => {
    getUserUrlClickStats();
  }, []);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Unique Visitors</CardTitle>
        <CardDescription>
          {clickStats ? (
            <span className="text-4xl font-bold">{clickStats.count}</span>
          ) : (
            <span className="text-4xl font-bold">Loading...</span>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="aspect-[9/4]">
          {clickStats && clickStats.data ? (
            <ResponsiveBar
              data={clickStats.data as BarDatum[]}
              keys={["count"]}
              indexBy="name"
              margin={{ top: 0, right: 0, bottom: 40, left: 40 }}
              padding={0.3}
              colors={["#2563eb"]}
              axisBottom={{
                tickSize: 0,
                tickPadding: 16,
              }}
              axisLeft={{
                tickSize: 0,
                tickValues: 4,
                tickPadding: 16,
              }}
              gridYValues={4}
              theme={{
                tooltip: {
                  chip: {
                    borderRadius: "9999px",
                  },
                  container: {
                    fontSize: "12px",
                    textTransform: "capitalize",
                    borderRadius: "6px",
                  },
                },
                grid: {
                  line: {
                    stroke: "#f3f4f6",
                  },
                },
              }}
              tooltipLabel={({ id }) => `${id}`}
              enableLabel={false}
              role="application"
              ariaLabel="A bar chart showing data"
            />
          ) : (
            <p>Loading chart data...</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
