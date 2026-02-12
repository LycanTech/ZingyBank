# Stage 1: Build
FROM eclipse-temurin:21-jdk-alpine AS builder
WORKDIR /build

# Copy parent POM and service POM for dependency caching
COPY pom.xml /build/parent-pom.xml
COPY services/api-gateway/pom.xml /build/pom.xml

# Download dependencies (cached layer)
RUN --mount=type=cache,target=/root/.m2 \
    mvn -f /build/parent-pom.xml dependency:go-offline -N && \
    mvn dependency:go-offline

# Copy source and build
COPY services/api-gateway/src ./src
RUN --mount=type=cache,target=/root/.m2 \
    mvn package -DskipTests -q

# Stage 2: Runtime
FROM eclipse-temurin:21-jre-alpine

# Security: run as non-root user (PCI DSS requirement)
RUN addgroup -S zingybank && adduser -S zingybank -G zingybank
USER zingybank

WORKDIR /app

COPY --from=builder /build/target/*.jar app.jar

# Health check
HEALTHCHECK --interval=30s --timeout=10s --retries=3 --start-period=40s \
    CMD wget -qO- http://localhost:8080/actuator/health || exit 1

EXPOSE 8080

ENTRYPOINT ["java", "-XX:+UseContainerSupport", "-XX:MaxRAMPercentage=75.0", "-jar", "app.jar"]
