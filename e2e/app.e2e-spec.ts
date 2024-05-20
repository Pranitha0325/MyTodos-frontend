import { todoApplicationTemplatePage } from './app.po';

describe('todoApplication App', function() {
  let page: todoApplicationTemplatePage;

  beforeEach(() => {
    page = new todoApplicationTemplatePage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
