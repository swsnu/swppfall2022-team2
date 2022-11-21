from bs4 import BeautifulSoup
import requests
from menu.models import TodayMenu


def crontab_every_hour():
    #fresh start
    TodayMenu.objects.all().delete()
    html_text = requests.get('https://snumenu.gerosyab.net/ko/menus').text
    soup = BeautifulSoup(html_text, 'lxml')
    menu_list = []

    restaurants = soup.find_all('div', class_='restaurant')

    for restaurant in restaurants:
        menu_place = restaurant.find('div', class_='restaurant-name').text.strip()
        breakfast = restaurant.find('div', class_='meal breakfast')
        lunch = restaurant.find('div', class_='meal lunch')
        dinner = restaurant.find('div', class_='meal dinner')
        mealtypes = [breakfast, lunch, dinner]

        for mealtype in mealtypes:
            if mealtype is not None:
                mealtype_name = mealtype.find("div", class_="meal-type").text
                menus = mealtype.find_all('div', class_='menu')
                for menu in menus:
                    menu_name=""
                    menu_price=""
                    menuname = menu.find('div', class_='menu-name-with-price')

                    if menuname is not None:
                        menu_name=menuname.text.strip()
                    else:
                        menuname = menu.find('div', class_='menu-name-without-price')
                        extra_menu = menuname.find('a', 'modal-link').text.strip()
                        if extra_menu == "주문은 10분전 마감":
                            continue
                        elif extra_menu == "(3층교직메뉴)":
                            continue
                        elif extra_menu.startswith('<'):
                            continue
                        else:
                            menu_list[-1]["extra"].append(extra_menu)
                        continue
                    menuprice = menu.find('div', class_='menu-price')
                    if hasattr(menuprice, 'text'):
                        menu_price=menuprice.text.strip()
                    menu_list.append({'meal-type':mealtype_name, 'menu-place': menu_place, 'menu-name':menu_name, 'menu-price':menu_price, 'extra':[]})

    for menu_item in menu_list:
        new_menu = TodayMenu(mealtype=menu_item['meal-type'], menuplace=menu_item['menu-place'], menuname=menu_item['menu-name'], menuprice=menu_item['menu-price'], menuextra=' '.join([str(elem) for i,elem in enumerate(menu_item['extra'])]))
        new_menu.save()