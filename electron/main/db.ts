import path from "node:path";
import betterSqlite3 from "better-sqlite3";
import { fileURLToPath } from "node:url";
import { app } from "electron";
import { format } from "date-fns";

interface User {
    id?: number;
    username: string;
    password: string;
}

// Define allowed status values
type ReportStatus = "pending" | "in-progress" | "completed" | "cancelled";

interface Report {
    id?: number;
    status: ReportStatus;
    createdAt: string;
}

interface Result {
    lastInsertRowid: number;
}

class DatabaseManager {
    private static db: betterSqlite3.Database | null = null;

    private static getDatabasePath(): string {
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);
        return app.isPackaged
            ? path.join(app.getPath("userData"), "database.db")
            : path.join(__dirname, "../../src/db/database.db");
    }

    public static initializeDatabase(): void {
        const dbPath = this.getDatabasePath();
        try {
            this.db = betterSqlite3(dbPath);
            console.log("Connected to the database.");
            this.createTables();
        } catch (err) {
            console.error("Could not open database:", err);
        }
    }

    private static createTables(): void {
        const queries = [
            `CREATE TABLE IF NOT EXISTS user (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT NOT NULL,
                password TEXT NOT NULL
            )`,
            `CREATE TABLE IF NOT EXISTS report (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                status TEXT NOT NULL DEFAULT 'pending',
                createdAt TEXT NOT NULL,
                CHECK (status IN ('pending', 'in-progress', 'completed', 'cancelled'))
            )`,
        ];

        queries.forEach((query) => {
            try {
                this.db?.exec(query);
            } catch (err) {
                console.error("Error creating tables:", err);
            }
        });
    }

    private static prepareStatement(
        query: string
    ): betterSqlite3.Statement | undefined {
        try {
            return this.db?.prepare(query);
        } catch (err) {
            console.error("Error preparing statement:", err);
            return undefined;
        }
    }

    // ******************** Users ********************
    public static getUsers(): User[] {
        const query = "SELECT * FROM user";
        return this.executeQuery(query);
    }

    public static addUser(username: string, password: string): User {
        const stmt = this.prepareStatement(
            "INSERT INTO user (username, password) VALUES (?, ?)"
        );
        const result = stmt?.run(username, password) as Result;
        return { id: result?.lastInsertRowid, username, password: "" };
    }

    public static updateUser(
        id: number,
        username: string,
        password: string
    ): User {
        const stmt = this.prepareStatement(
            "UPDATE user SET username = ?, password = ? WHERE id = ?"
        );
        stmt?.run(username, password, id);
        return { id, username, password: "" };
    }

    public static deleteUser(id: number): { success: boolean } {
        const stmt = this.prepareStatement("DELETE FROM user WHERE id = ?");
        stmt?.run(id);
        return { success: true };
    }

    // ******************** Reports ********************
    public static getReports(statusFilter?: string, date?: string): Report[] {
        // Format date if provided
        const formattedDate = date
            ? format(new Date(date), "yyyy-MM-dd")
            : undefined;

        // Construct the base query
        let query = "SELECT * FROM report";
        const params: any[] = [];

        // Add conditions for statusFilter and date
        if (statusFilter || formattedDate) {
            query += " WHERE";
            if (statusFilter) {
                query += " status = ?";
                params.push(statusFilter);
            }
            if (formattedDate) {
                query += statusFilter ? " AND" : "";
                query += " DATE(createdAt) = ?";
                params.push(formattedDate);
            }
        }

        return this.executeQuery(query, params);
    }

    public static getInProgressReportIndex(): number | null {
        const today = format(new Date(), "yyyy-MM-dd");

        const query = `
        SELECT rowIndex
        FROM (
            SELECT 
                id, 
                status, 
                row_number() OVER (ORDER BY id) as rowIndex
            FROM report
            WHERE DATE(createdAt) = ?
        ) AS todayReports
        WHERE status = 'in-progress'
        LIMIT 1;
    `;

        const result = this.executeQuery(query, [today]) as {
            rowIndex: number;
        }[];

        return result.length ? result[0].rowIndex : null;
    }

    public static getReportsByDay(
        startDate: string
    ): { date: string; reportCount: number }[] {
        
        const query = `
            SELECT 
                DATE(createdAt) as date, 
                COUNT(*) as reportCount
            FROM report
            WHERE DATE(createdAt) >= ?
            GROUP BY DATE(createdAt)
            ORDER BY DATE(createdAt);
        `;

        return this.executeQuery(query, [startDate]) as {
            date: string;
            reportCount: number;
        }[];
    }

    public static addReport(
        status: ReportStatus = "pending",
        createdAt: string = new Date().toISOString()
    ): Report {
        const stmt = this.prepareStatement(
            "INSERT INTO report (status, createdAt) VALUES (?, ?)"
        );
        const result = stmt?.run(status, createdAt) as Result;
        return {
            id: result?.lastInsertRowid,
            status,
            createdAt,
        };
    }

    public static updateReport(id: number, status: ReportStatus): Report {
        const stmt = this.prepareStatement(
            "UPDATE report SET status = ? WHERE id = ?"
        );
        stmt?.run(status, id);
        return { id, status, createdAt: "" };
    }

    public static deleteReport(id: number): { success: boolean } {
        const stmt = this.prepareStatement("DELETE FROM report WHERE id = ?");
        stmt?.run(id);
        return { success: true };
    }

    public static getFirstReportDate(): string | null {
        const query = `SELECT MIN(createdAt) as firstDate FROM report`;
        const stmt = this.prepareStatement(query);
        const result = stmt?.get() as { firstDate: string | null };
        return result?.firstDate || null;
    }

    private static executeQuery(query: string, params: any[] = []): any[] {
        try {
            const stmt = this.prepareStatement(query);
            return stmt?.all(...params) || [];
        } catch (err) {
            console.error("Error executing query:", err);
            throw err;
        }
    }

    public static closeDatabase(): void {
        if (this.db) {
            this.db.close();
        }
    }
}

export default DatabaseManager;
