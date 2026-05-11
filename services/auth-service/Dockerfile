# Stage 1: Build
FROM maven:3.9-eclipse-temurin-21-alpine AS builder
WORKDIR /build

COPY pom.xml /build/parent-pom.xml
COPY services/auth-service/pom.xml /build/pom.xml

RUN mvn install -f /build/parent-pom.xml -N -q && \
    mvn dependency:go-offline -q

COPY services/auth-service/src ./src
RUN mvn package -DskipTests -q

# Stage 2: Runtime
FROM eclipse-temurin:21-jre-alpine

RUN addgroup -S zingybank && adduser -S zingybank -G zingybank
USER zingybank

WORKDIR /app
COPY --from=builder /build/target/*.jar app.jar

EXPOSE 8081
ENTRYPOINT ["java", "-XX:+UseContainerSupport", "-XX:MaxRAMPercentage=75.0", "-jar", "app.jar"]
