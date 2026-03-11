# Stage 1: Build
FROM maven:3.9-eclipse-temurin-21-alpine AS builder
WORKDIR /build

# Copy parent POM and service POM for dependency caching
COPY pom.xml /build/parent-pom.xml
COPY services/audit-service/pom.xml /build/pom.xml

# Install parent POM and download dependencies (cached layer)
RUN --mount=type=cache,target=/root/.m2 \
    mvn install -f /build/parent-pom.xml -N -q && \
    mvn dependency:go-offline -q

# Copy source and build
COPY services/audit-service/src ./src
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
    CMD wget -qO- http://localhost:8090/actuator/health || exit 1

EXPOSE 8090

ENTRYPOINT ["java", "-XX:+UseContainerSupport", "-XX:MaxRAMPercentage=75.0", "-jar", "app.jar"]
