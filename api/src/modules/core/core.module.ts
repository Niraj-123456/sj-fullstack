import { Module } from "@nestjs/common";
import { CoreController } from "./core.controller";
import { CoreService } from "./core.service";

@Module({
  providers: [CoreService],
  controllers:[CoreController],
  exports:[CoreService]
})
export class CoreModule {}
