FROM busybox
ADD ./config.json /dist-rts/
ADD ./dist-rts_linux-amd64 /dist-rts/
ADD ./static /dist-rts/static
WORKDIR /dist-rts
CMD ["./dist-rts_linux-amd64"]
