FROM node:14

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

ENV DB_UNAME="root"
ENV DB_PWORD="sGkMCu1c91C2s5ax"
ENV DB_URL="mongodb+srv://$DB_UNAME:$DB_PWORD@cluster0.dx6mz.mongodb.net/?retryWrites=true&w=majority"
ENV PORT=2113
ENV AUTH_URL="https://dev-olak38adx0yzvpf1.us.auth0.com/"

EXPOSE $PORT
CMD [ "npm", "run", "start" ]