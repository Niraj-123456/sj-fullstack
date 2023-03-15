import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from 'modules/users/users.module';
import { CustomerInteraction } from './customer-interaction.entity';
import { CustomerInteractionService } from './customer-interaction.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([CustomerInteraction]),
    forwardRef(() => UserModule),
  ],
  providers: [CustomerInteractionService],
  exports: [CustomerInteractionService],
})
export class CustomerInteractionModule {}
