export interface LogEntry {
    ipAddress: string;
    remoteUser: string;
    authenticatedUser: string;
    timestamp: string;
    method: string;
    endpoint: string;
    protocol: string;
    status: number;
    bytes: number;
    referrer: string;
    userAgent: string;
}
