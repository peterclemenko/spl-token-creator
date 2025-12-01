import { Buffer } from "buffer";

if (!Buffer.SlowBuffer) {
  Buffer.SlowBuffer = function (len) {
    return Buffer.alloc(len);
  };
}
