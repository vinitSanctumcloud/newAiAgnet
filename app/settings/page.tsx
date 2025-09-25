import DashboardLayout from "@/components/DashboardLayout"

export default function SettingsPage() {
    return (
        <DashboardLayout>
            <div className="p-6">
                <h1 className="text-2xl font-bold mb-4">Settings</h1>
                <p>Manage your application settings here.</p>
            </div>
        </DashboardLayout>
    );
}