FROM node:14-stretch AS apisdev
WORKDIR /var/www/basicNode
COPY package.json .
RUN yarn install
FROM node:14-stretch
WORKDIR /var/www/basicNode
COPY --from=apisdev /var/www/basicNode/node_modules /var/www/basicNode/node_modules
COPY --from=apisdev /var/www/basicNode/yarn.lock /var/www/basicNode/yarn.lock
COPY ./ /var/www/basicNode
RUN chown -R node.node /var/www/basicNode
USER node
EXPOSE 8080
ENTRYPOINT ["npm", "run", "dev"]
