'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-3xl font-bold text-center">
            Registration
          </CardTitle>
          <CardDescription className="text-center">
            Contact your system administrator to create an account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-blue-50 rounded-md border border-blue-200">
            <h3 className="font-semibold text-blue-900 mb-2">
              Account Registration Process:
            </h3>
            <ol className="list-decimal list-inside space-y-2 text-sm text-blue-800">
              <li>Contact your system administrator or IT department</li>
              <li>Provide your email address and department information</li>
              <li>Administrator will create your account and assign appropriate role</li>
              <li>You'll receive an invitation email with login instructions</li>
              <li>Sign in using the credentials provided</li>
            </ol>
          </div>

          <div className="p-4 bg-gray-50 rounded-md border border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-2">
              User Roles:
            </h3>
            <ul className="space-y-1 text-sm text-gray-700">
              <li><strong>Super Admin:</strong> Full platform access and configuration</li>
              <li><strong>Admin:</strong> Manage departments, KPIs, and users</li>
              <li><strong>Manager:</strong> View department performance, drill-down access</li>
              <li><strong>Operator:</strong> Enter data for assigned KPIs</li>
              <li><strong>Viewer:</strong> Read-only access to dashboards</li>
            </ul>
          </div>

          <Button
            className="w-full"
            variant="outline"
            onClick={() => window.location.href = '/auth/login'}
          >
            Back to Login
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
