import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChatComponent } from './chat.component';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { loadChannels, loadMessages, sendMessage } from './store/chat.actions';

describe('ChatComponent', () => {
  let component: ChatComponent;
  let fixture: ComponentFixture<ChatComponent>;
  let store: jasmine.SpyObj<Store>;

  beforeEach(async () => {
    const storeSpy = jasmine.createSpyObj('Store', ['dispatch', 'select']);
    storeSpy.select.and.returnValue(of([]));

    await TestBed.configureTestingModule({
      imports: [ChatComponent],
      providers: [
        { provide: Store, useValue: storeSpy }
      ]
    }).compileComponents();

    store = TestBed.inject(Store) as jasmine.SpyObj<Store>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load channels and messages on init', () => {
    component.ngOnInit();
    
    expect(store.dispatch).toHaveBeenCalledWith(loadChannels());
    expect(store.dispatch).toHaveBeenCalledWith(
      loadMessages({ channelId: component.currentChannelId })
    );
  });

  it('should send message when form is submitted with non-empty message', () => {
    const message = 'Test message';
    component.messageInput.setValue(message);
    component.currentChannelId = '1';
    
    component.sendMessage();
    
    expect(store.dispatch).toHaveBeenCalledWith(
      sendMessage({ content: message, channelId: '1' })
    );
    expect(component.messageInput.value).toBe('');
  });

  it('should not send empty message', () => {
    component.messageInput.setValue('   ');
    component.sendMessage();
    
    expect(store.dispatch).not.toHaveBeenCalled();
  });
}); 