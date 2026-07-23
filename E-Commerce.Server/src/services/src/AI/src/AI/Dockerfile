FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS base
RUN apt-get update && apt-get install -y --no-install-recommends \
    libgssapi-krb5-2 \
    libfontconfig1 \
    libfreetype6 \
    libpng16-16 \
    libx11-6 \
    libxext6 \
    && rm -rf /var/lib/apt/lists/*
WORKDIR /app
EXPOSE 8080
EXPOSE 8081

FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

# Copy project files first so NuGet restore can use Docker layer caching.
COPY ["src/shared/E-Commerce.Server.Shared.AI/E-Commerce.Server.Shared.AI/E-Commerce.Server.Shared.AI.csproj", "shared/E-Commerce.Server.Shared.AI/E-Commerce.Server.Shared.AI/"]
COPY ["src/shared/E-Commerce.Server.Shared.Authentication/E-Commerce.Server.Shared.Authentication/E-Commerce.Server.Shared.Authentication.csproj", "shared/E-Commerce.Server.Shared.Authentication/E-Commerce.Server.Shared.Authentication/"]
COPY ["src/shared/E-Commerce.Server.Shared.Authorization/E-Commerce.Server.Shared.Authorization/E-Commerce.Server.Shared.Authorization.csproj", "shared/E-Commerce.Server.Shared.Authorization/E-Commerce.Server.Shared.Authorization/"]
COPY ["src/shared/E-Commerce.Server.Shared.Caching/E-Commerce.Server.Shared.Caching/E-Commerce.Server.Shared.Caching.csproj", "shared/E-Commerce.Server.Shared.Caching/E-Commerce.Server.Shared.Caching/"]
COPY ["src/shared/E-Commerce.Server.Shared.Contracts/E-Commerce.Server.Shared.Contracts/E-Commerce.Server.Shared.Contracts.csproj", "shared/E-Commerce.Server.Shared.Contracts/E-Commerce.Server.Shared.Contracts/"]
COPY ["src/shared/E-Commerce.Server.Shared.EmailService/E-Commerce.Server.Shared.EmailService/E-Commerce.Server.Shared.EmailService.csproj", "shared/E-Commerce.Server.Shared.EmailService/E-Commerce.Server.Shared.EmailService/"]
COPY ["src/shared/E-Commerce.Server.Shared.Localization/E-Commerce.Server.Shared.Localization/E-Commerce.Server.Shared.Localization.csproj", "shared/E-Commerce.Server.Shared.Localization/E-Commerce.Server.Shared.Localization/"]
COPY ["src/shared/E-Commerce.Server.Shared.Logging/E-Commerce.Server.Shared.Logging/E-Commerce.Server.Shared.Logging.csproj", "shared/E-Commerce.Server.Shared.Logging/E-Commerce.Server.Shared.Logging/"]
COPY ["src/shared/E-Commerce.Server.Shared.Middleware/E-Commerce.Server.Shared.Middleware/E-Commerce.Server.Shared.Middleware.csproj", "shared/E-Commerce.Server.Shared.Middleware/E-Commerce.Server.Shared.Middleware/"]
COPY ["src/shared/E-Commerce.Server.Shared.Storage/E-Commerce.Server.Shared.Storage/E-Commerce.Server.Shared.Storage.csproj", "shared/E-Commerce.Server.Shared.Storage/E-Commerce.Server.Shared.Storage/"]
COPY ["src/shared/E-Commerce.Server.Shared.WebAuthentication/E-Commerce.Server.Shared.WebAuthentication/E-Commerce.Server.Shared.WebAuthentication.csproj", "shared/E-Commerce.Server.Shared.WebAuthentication/E-Commerce.Server.Shared.WebAuthentication/"]
COPY ["src/services/src/AI/src/AI/AI.csproj", "services/src/AI/src/AI/"]
COPY ["src/services/src/AI/src/Core/AI.Application/AI.Application.csproj", "services/src/AI/src/Core/AI.Application/"]
COPY ["src/services/src/AI/src/Core/AI.Domain/AI.Domain.csproj", "services/src/AI/src/Core/AI.Domain/"]
COPY ["src/services/src/AI/src/External/AI.Infrastructure/AI.Infrastructure.csproj", "services/src/AI/src/External/AI.Infrastructure/"]
COPY ["src/services/src/AI/src/External/AI.Persistance/AI.Persistance.csproj", "services/src/AI/src/External/AI.Persistance/"]
COPY ["src/services/src/AI/src/External/AI.Presentation/AI.Presentation.csproj", "services/src/AI/src/External/AI.Presentation/"]

RUN dotnet restore "services/src/AI/src/AI/AI.csproj"

COPY ["src/", "."]

WORKDIR /src/services/src/AI/src/AI
RUN dotnet publish "AI.csproj" -c Release -o /app/publish --no-restore /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "AI.dll"]
