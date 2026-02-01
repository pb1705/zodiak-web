FROM alpine:latest

# Install curl and bash
RUN apk add --no-cache curl bash

# Create app directory
WORKDIR /app

# Copy the keepalive script
COPY keep-alive.sh ./

# Make script executable
RUN chmod +x keep-alive.sh

# Run the script
CMD ["./keep-alive.sh"]