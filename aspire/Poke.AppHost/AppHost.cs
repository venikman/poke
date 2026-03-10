var builder = DistributedApplication.CreateBuilder(args);

var repoRoot = Path.GetFullPath(Path.Combine(builder.AppHostDirectory, "..", ".."));
var npmCommand = OperatingSystem.IsWindows() ? "npm.cmd" : "npm";

builder
    .AddExecutable("frontend", npmCommand, repoRoot, "exec", "rsbuild", "dev")
    .WithEnvironment("NODE_ENV", "development")
    .WithHttpEndpoint(targetPort: 5173, port: 5173, name: "http", isProxied: false)
    .WithHttpHealthCheck("/");

builder
    .AddExecutable("api", npmCommand, repoRoot, "exec", "tsx", "--watch", "server/main.ts")
    .WithEnvironment("NODE_ENV", "development")
    .WithEnvironment("PORT", "3001")
    .WithHttpEndpoint(targetPort: 3001, port: 3001, name: "http", isProxied: false)
    .WithHttpHealthCheck("/api/v1/hello");

builder.Build().Run();
