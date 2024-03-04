import { LogEntry } from "./types";

// Overall Analysed Requests Printer
export function printOverallAnalysedRequests(logEntries: LogEntry[]) {
    console.log("### Overall Analysed Requests ###");
    console.log("\n");

    // Total Requests
    console.log(`Total Requests: ${logEntries.length}`);

    // Unique Visitors
    const uniqueVisitors = new Set<string>();
    logEntries.forEach(entry => {
        uniqueVisitors.add(entry.ipAddress);
    });
    console.log(`Unique Visitors: ${uniqueVisitors.size}`);

    // Unique Referrers
    const uniqueReferrers = new Set<string>();
    logEntries.forEach(entry => {
        uniqueReferrers.add(entry.referrer);
    });
    console.log(`Unique Referrers: ${uniqueReferrers.size}`);

    // Valid Requests
    const validRequests = logEntries.filter(entry => entry.status >= 200 && entry.status < 400);
    console.log(`Valid Requests: ${validRequests.length}`);

    // Unique Files
    const uniqueFiles = new Set<string>();
    logEntries.forEach(entry => {
        uniqueFiles.add(entry.endpoint);
    });
    console.log(`Unique Files: ${uniqueFiles.size}`);

    // Unique 404s
    const unique404s = logEntries.filter(entry => entry.status === 404);
    console.log(`Unique 404s: ${unique404s.length}`);

    // Log Size
    const logSize = logEntries.reduce((total, entry) => total + entry.bytes, 0);
    console.log(`Log Size: ${logSize} bytes`);

    // Failed Requests Numbers
    const failedRequests = logEntries.filter(entry => entry.status >= 400);
    console.log(`Failed Requests: ${failedRequests.length}`);

    console.log("\n");
}

// Unique Visitors per Day Printer
export function printUniqueVisitorsPerDay(logEntries: LogEntry[]) {
    console.log("### Unique Visitors per Day ###");
    console.log("\n");

    const uniqueDates = new Set<string>();
    logEntries.forEach(entry => {
        const date = entry.timestamp.substring(0, 11);
        uniqueDates.add(date);
    });

    const uniqueDatesWithCounts = Array.from(uniqueDates).map(date => {
        const entriesForDate = logEntries.filter(entry => entry.timestamp.startsWith(date));
        return { date, count: entriesForDate.length };
    });

    const sortedUniqueDatesWithCounts = uniqueDatesWithCounts.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateB.getTime() - dateA.getTime();
    });

    sortedUniqueDatesWithCounts.forEach(({ date, count }) => {
        const entriesForDate = logEntries.filter(entry => entry.timestamp.startsWith(date));
        const totalBytes = entriesForDate.reduce((total, entry) => total + entry.bytes, 0);
        const totalBytesKiB = totalBytes / 1024;
        console.log(`${count} : ${totalBytesKiB.toFixed(2)} KiB : ${date}`);
    });
    console.log("\n");
}

// Requested Files Printer
export function printRequestedFiles(logEntries: LogEntry[]) {
    console.log("### Requested Files ###");
    console.log("\n");

    const files: { [key: string]: { count: number; totalBytes: number; method: string; protocol: string } } = {};

    logEntries.forEach(entry => {
        const endpoint = entry.endpoint;
        if (!files[endpoint]) {
            files[endpoint] = { count: 0, totalBytes: 0, method: entry.method, protocol: entry.protocol };
        }
        files[endpoint].count++;
        files[endpoint].totalBytes += entry.bytes;
    });

    const sortedFiles = Object.entries(files).sort((a, b) => b[1].count - a[1].count);

    sortedFiles.forEach(([file, { count, totalBytes, method, protocol }]) => {
        const totalBytesKiB = totalBytes / 1024;
        console.log(`${count} : ${totalBytesKiB.toFixed(2)} KiB : ${method} : ${protocol} : ${file}`);
    });

    console.log("\n");
}

// 404 Requested Files Printer
export function print404RequestedFiles(logEntries: LogEntry[]) {
    console.log("### 404 Requested Files ###");
    console.log("\n");

    const notFoundFiles: { [key: string]: { count: number; totalBytes: number; method: string; protocol: string } } = {};

    logEntries.forEach(entry => {
        if (entry.status === 404) {
            const endpoint = entry.endpoint;
            if (!notFoundFiles[endpoint]) {
                notFoundFiles[endpoint] = { count: 0, totalBytes: 0, method: entry.method, protocol: entry.protocol };
            }
            notFoundFiles[endpoint].count++;
            notFoundFiles[endpoint].totalBytes += entry.bytes;
        }
    });

    const sortedNotFoundFiles = Object.entries(notFoundFiles).sort((a, b) => b[1].count - a[1].count);

    sortedNotFoundFiles.forEach(([file, { count, totalBytes, method, protocol }]) => {
        const totalBytesKiB = totalBytes / 1024;
        console.log(`${count} : ${totalBytesKiB.toFixed(2)} KiB : ${method} : ${protocol} : ${file}`);
    });

    console.log("\n");
}
