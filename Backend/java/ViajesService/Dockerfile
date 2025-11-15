# Etapa 1 - Compilación
FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

# Etapa 2 - Ejecución
FROM eclipse-temurin:17-jdk-jammy
WORKDIR /app
COPY --from=build /app/target/*.jar viajes-api.jar
EXPOSE 8083
ENTRYPOINT ["java", "-jar", "viajes-api.jar"]