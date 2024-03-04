import { LogEntry } from './types';

// Function to parse a single log entry
export function parseLogEntry(logString: string): LogEntry {
    const [
        ipAddress,
        remoteUser,
        authenticatedUser,
        timestamp1,
        timestamp2,
        _method,
        endpoint,
        protocol,
        status,
        bytes,
        referrer,
        ...agent
    ] = logString.split(' ');

    const userAgent = agent.join(" ");
    return {
        ipAddress,
        remoteUser,
        authenticatedUser,
        timestamp: timestamp1.substring(1, timestamp1.length) + timestamp2.substring(0, timestamp2.length -1),
        method: _method.substring(1),
        endpoint,
        protocol: protocol.substring(0, protocol.length - 1),
        status: parseInt(status),
        bytes: parseInt(bytes),
        referrer: referrer.substring(1, referrer.length - 1),
        userAgent: userAgent.substring(1, userAgent.length - 2)
    };
}

// Function to parse an entire log file
export function parseLogFile(logFileContent: string): LogEntry[] {
    const logEntries: LogEntry[] = [];
    const lines = logFileContent.split('\n');
    lines.forEach(line => {
        if (line.trim() !== '') {
            logEntries.push(parseLogEntry(line));
        }
    });
    return logEntries;
}
