import { createServerClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default async function DashboardPage() {
  const supabase = createServerClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect('/auth/login');
  }

  // Fetch user profile
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', session.user.id)
    .single();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">
              KPI Platform Dashboard
            </h1>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                {profile?.full_name || session.user.email}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {profile?.role || 'user'}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Welcome Card */}
          <Card className="col-span-full">
            <CardHeader>
              <CardTitle>Welcome to KPI Platform! 🎉</CardTitle>
              <CardDescription>
                Your manufacturing excellence tracking system is ready to use
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-green-50 rounded-md border border-green-200">
                <h3 className="font-semibold text-green-900 mb-2">
                  ✅ Setup Complete!
                </h3>
                <p className="text-sm text-green-800">
                  You've successfully set up the KPI Platform. Here's what you can do next:
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 rounded-md border border-blue-200">
                  <h4 className="font-semibold text-blue-900 mb-2">
                    1. Set Up Organization
                  </h4>
                  <p className="text-sm text-blue-800">
                    Configure your organization details and vision statement
                  </p>
                </div>

                <div className="p-4 bg-purple-50 rounded-md border border-purple-200">
                  <h4 className="font-semibold text-purple-900 mb-2">
                    2. Create Departments
                  </h4>
                  <p className="text-sm text-purple-800">
                    Build your department hierarchy (Plant → Department → Lines)
                  </p>
                </div>

                <div className="p-4 bg-orange-50 rounded-md border border-orange-200">
                  <h4 className="font-semibold text-orange-900 mb-2">
                    3. Define KPIs
                  </h4>
                  <p className="text-sm text-orange-800">
                    Create KPI definitions (OEE, MTBF, RFT, etc.)
                  </p>
                </div>

                <div className="p-4 bg-green-50 rounded-md border border-green-200">
                  <h4 className="font-semibold text-green-900 mb-2">
                    4. Assign & Track
                  </h4>
                  <p className="text-sm text-green-800">
                    Assign KPIs to departments and start entering data
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats (Placeholder) */}
          <Card>
            <CardHeader>
              <CardTitle>Departments</CardTitle>
              <CardDescription>Total departments</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">0</p>
              <p className="text-sm text-gray-500 mt-2">
                No departments yet. Create your first department to get started.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>KPI Definitions</CardTitle>
              <CardDescription>Configured KPIs</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">0</p>
              <p className="text-sm text-gray-500 mt-2">
                Define your first KPI to start tracking performance.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Active Users</CardTitle>
              <CardDescription>Team members</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">1</p>
              <p className="text-sm text-gray-500 mt-2">
                You're the first user! Invite your team to collaborate.
              </p>
            </CardContent>
          </Card>

          {/* Next Steps */}
          <Card className="col-span-full">
            <CardHeader>
              <CardTitle>Development Roadmap</CardTitle>
              <CardDescription>
                Features available in this platform
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    ✅ Phase 1: Foundation (Complete)
                  </h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                    <li>Next.js 14 + TypeScript setup</li>
                    <li>Supabase integration</li>
                    <li>Authentication system</li>
                    <li>Database schema</li>
                    <li>Basic UI components</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    🚧 Phase 2: Core Features (In Progress)
                  </h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                    <li>Department management</li>
                    <li>KPI definition interface</li>
                    <li>Data entry forms</li>
                    <li>Calculation engine</li>
                    <li>Basic dashboards</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    📋 Phase 3: Advanced Features
                  </h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                    <li>Cascading KPIs</li>
                    <li>Dynamic dashboard builder</li>
                    <li>Advanced visualizations</li>
                    <li>Role-based access control</li>
                    <li>Real-time updates</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    🔮 Phase 4: Future Ready
                  </h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                    <li>API integrations</li>
                    <li>Lean tools (Fishbone, 5 Whys)</li>
                    <li>AI/GPT insights</li>
                    <li>Automated data collection</li>
                    <li>Mobile apps</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
