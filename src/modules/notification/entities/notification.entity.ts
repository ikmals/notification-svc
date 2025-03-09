import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Notification extends Document {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  companyId: string;

  @Prop({ required: true })
  type: string;

  @Prop({ required: true })
  channel?: string;

  @Prop()
  subject?: string;

  @Prop()
  content?: string;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
