#### Stage 1: Build the application
FROM openjdk:8-jdk-alpine as build

# Set the current working directory inside the image
WORKDIR /app

# Copy maven executable to the image
#COPY mvnw .
#COPY .mvn .mvn

ENV MAVEN_HOME=/usr/share/maven

RUN apk --no-cache add ca-certificates openssl &&  update-ca-certificates

RUN cd /tmp \
   && wget https://archive.apache.org/dist/maven/maven-3/3.3.9/binaries/apache-maven-3.3.9-bin.tar.gz \
   && wget https://archive.apache.org/dist/maven/maven-3/3.3.9/binaries/apache-maven-3.3.9-bin.tar.gz.sha1 \
   && echo -e "$(cat apache-maven-3.3.9-bin.tar.gz.sha1)  apache-maven-3.3.9-bin.tar.gz" | sha1sum -c - \
   && tar zxf apache-maven-3.3.9-bin.tar.gz \
   && rm -rf apache-maven-3.3.9-bin.tar.gz \
   && rm -rf *.sha1 \
   && mv ./apache-maven-3.3.9 /usr/share/maven \
   && ln -s /usr/share/maven/bin/mvn /usr/bin/mvn

ENV MVN=$MAVEN_HOME/bin/mvn

#RUN apt-get install git-core curl build-essential openssl libssl-dev \
# && git clone https://github.com/nodejs/node.git \
# && cd node \
# && ./configure \
# && make \
# && sudo make install

# Copy the pom.xml file
COPY pom.xml .

# Build all the dependencies in preparation to go offline.
# This is a separate step so the dependencies will be cached unless
# the pom.xml file has changed.
RUN $MVN dependency:go-offline -B

# Copy the project source
COPY src src
COPY package.json ./webpack.config.js ./

# Package the application
RUN $MVN package -DskipTests
RUN mkdir -p target/dependency && (cd target/dependency; jar -xf ../*.jar)

#### Stage 2: A minimal docker image with command to run the app
FROM openjdk:8-jre-alpine

ARG DEPENDENCY=/app/target/dependency

# Copy project dependencies from the build stage
COPY --from=build ${DEPENDENCY}/BOOT-INF/lib /app/lib
COPY --from=build ${DEPENDENCY}/META-INF /app/META-INF
COPY --from=build ${DEPENDENCY}/BOOT-INF/classes /app

ENTRYPOINT ["java","-cp","app:app/lib/*","com.example.polls.PollsApplication"]