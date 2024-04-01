import { createParamDecorator, ExecutionContext } from "@nestjs/common";


export const RawHeaders = createParamDecorator( 
    (data:string, ctx: ExecutionContext) =>{
        
        const req = ctx.switchToHttp().getRequest();
        const reqRawHeaders = req.rawHeaders;
    
        return reqRawHeaders;
    }
); 