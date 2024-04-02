
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { MessagesWsService } from './messages-ws.service';
import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { NewMessageDto } from './dtos/new-message.dto';
import { JwtPayload } from 'src/auth/interfaces';

@WebSocketGateway({cors:true})
export class MessagesWsGateway implements OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer() wss: Server;


  constructor(private readonly messagesWsService: MessagesWsService,
    private readonly jwtService: JwtService
    
  ) {}
  
  async handleConnection(client: Socket) {
    const token = client.handshake.headers.auth as string;
    let payload : JwtPayload;
    
    try {
      payload = this.jwtService.verify(token);
      
      await this.messagesWsService.registerClient(client, payload.id);

    } catch (error) {
      client.disconnect();
      return;
    }
    
    //console.log({payload});

    
    //console.log({connected: this.messagesWsService.getConnectedCustomers()});
    
    this.wss.emit('clients-updated', this.messagesWsService.getConnectedCustomers() );

  }
  handleDisconnect(client: Socket) {
    this.messagesWsService.removeClient(client.id);
    //console.log({connected: this.messagesWsService.getConnectedCustomers()});

    this.wss.emit('clients-updated', this.messagesWsService.getConnectedCustomers() );
  }

  @SubscribeMessage('message-from-customer')
  onMessageFromClient( customer : Socket, payload: NewMessageDto){
    

    //Emit only to customer
    // customer.emit('message-from-server', {
    //   fullName: 'I am',
    //   message: payload.message || 'no message'
    // })
  
    //emit everybody without customer
    // customer.broadcast.emit('message-from-server', {
    //   fullName: 'I am',
    //   message: payload.message || 'no message'
    // })

    this.wss.emit('message-from-server', {
        fullName: this.messagesWsService.getUserFullName(customer.id),
        message: payload.message || 'no message'
      })
  }

}
