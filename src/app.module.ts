import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ServeStaticModule } from '@nestjs/serve-static';
import { getStaticFilesPath } from './utils/path';

@Module({
	imports: [
		ServeStaticModule.forRoot({
			rootPath: getStaticFilesPath(),
		}),
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
