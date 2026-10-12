# Stage 1: Build the Spring Boot application
FROM maven:3.9.6-eclipse-temurin-17-alpine AS builder
WORKDIR /build

# Cache dependencies
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy source and build jar
COPY src ./src
RUN mvn clean package -DskipTests

# Stage 2: Create lightweight production runtime image
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Copy the built jar from builder stage
COPY --from=builder /build/target/*.jar app.jar

# Dynamic port for cloud platforms (Render, Railway, etc.)
EXPOSE 8080
ENV PORT=8080

ENTRYPOINT ["sh", "-c", "java -jar -Dserver.port=${PORT} app.jar"]
