# Etapa 1 - Compilación
FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /app

# Copiamos el proyecto Java completo
COPY EstacionesService/pom.xml .
COPY EstacionesService/src ./src

RUN mvn clean package -DskipTests

# Etapa 2 - Ejecución
FROM openjdk:17-jdk-slim
WORKDIR /app
COPY --from=build /app/target/*.jar railvision-api.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "railvision-api.jar"]
