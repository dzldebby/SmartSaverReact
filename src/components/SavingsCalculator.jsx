return (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <div className="space-y-4">
      {/* Bank Interest Calculator Form */}
      <Card>
        <CardHeader>
          <CardTitle>Bank Interest Calculator</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Form content */}
        </CardContent>
      </Card>
    </div>
    
    <div className="space-y-4">
      {/* Results Section */}
      {showResults && (
        <Card>
          <CardHeader>
            <CardTitle>Optimization Results</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Results content */}
          </CardContent>
        </Card>
      )}
    </div>
  </div>
); 