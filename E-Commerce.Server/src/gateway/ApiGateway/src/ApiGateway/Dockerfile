FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS base
RUN apt-get update && apt-get install -y --no-install-recommends libgssapi-krb5-2 && rm -rf /var/lib/apt/lists/*
WORKDIR /app
EXPOSE 8080
EXPOSE 8081

FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

COPY ["src/shared/E-Commerce.Server.Shared.Localization/E-Commerce.Server.Shared.Localization/E-Commerce.Server.Shared.Localization.csproj", "shared/E-Commerce.Server.Shared.Localization/E-Commerce.Server.Shared.Localization/"]
COPY ["src/shared/E-Commerce.Server.Shared.Middleware/E-Commerce.Server.Shared.Middleware/E-Commerce.Server.Shared.Middleware.csproj", "shared/E-Commerce.Server.Shared.Middleware/E-Commerce.Server.Shared.Middleware/"]
COPY ["src/gateway/ApiGateway/src/ApiGateway/ApiGateway.csproj", "gateway/ApiGateway/src/ApiGateway/"]

RUN dotnet restore "gateway/ApiGateway/src/ApiGateway/ApiGateway.csproj"

COPY ["src/", "."]

WORKDIR /src/gateway/ApiGateway/src/ApiGateway
RUN dotnet publish "ApiGateway.csproj" -c Release -o /app/publish --no-restore /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "ApiGateway.dll"]
