import {AfterViewInit, Component, QueryList, ViewChild, ViewChildren} from '@angular/core';
import {ExtensionService} from './classes/extension.service';
import {Card, CardOutput} from 'vscode-ipe-types';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
  cards: Card[] = [
    new Card(0, 'sample card', 'print("Hello, world!");', [new CardOutput('plaintext', 'Hello, world!')])
  ];
  selectedCards: number[] = [];

  onSelect(id: number){
    const index: number = this.selectedCards.indexOf(id, 1);
    if (index > -1) this.selectedCards.splice(index);
    else this.selectedCards.push(id);
  }

  moveUp(card: Card): void {
    const index: number = this.cards.indexOf(card, 1);
    if (index > -1){
      const tmp: Card = this.cards[index - 1];
      this.cards[index - 1] = this.cards[index];
      this.cards[index] = tmp;
    }
  }

  moveDown(hero: Card): void {
    let index: number = this.cards.indexOf(hero);
    if(index > -1 && index < this.cards.length - 1){
      let tmp: Card = this.cards[index+1];
      this.cards[index+1] = this.cards[index];
      this.cards[index] = tmp;
    }
  }

  delete(hero: Card): void {
    var index: number = this.cards.indexOf(hero);
    if (index > -1) this.cards.splice(index, 1);
  }

  constructor(private extension: ExtensionService) {
    extension.onAddCard.subscribe(card => {
      this.cards.push(card);
    });
  }


  /* this code ensures that the list always scrolls to the bottom when new elements are added */
  @ViewChildren('listItems') listItems: QueryList<any>;
  @ViewChild('scrollingList') scrollContainer;
  ngAfterViewInit() {
    this.listItems.changes.subscribe(() => this.scrollToBottom());
    this.scrollToBottom();
  }
  scrollToBottom() {
    try {
      this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
    } catch(err) { }
  }
}
